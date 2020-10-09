import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild, TemplateRef, Renderer2} from '@angular/core';
import { TableCoreDirective } from '../cores/table.core.directive';
import { TableService } from './dynamic-mat-table.service';
import { RowActionMenu, TableRow } from '../models/table-row.model';
import { TableField } from '../models/table-field.model';
import { AbstractFilter } from './extensions/filter/compare/abstract-filter';
import { TablePagination } from '../models/table-pagination.model';
import { HeaderFilterComponent } from './extensions/filter/header-filter.component';
import { isNull } from '../utilies/utils';
import { MatDialog } from '@angular/material/dialog';
import { PrintTableDialogComponent } from './extensions/print-dialog/print-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ResizeColumn } from '../models/resize-column.mode';
import { TableIntl } from '../international/table-Intl';
import { MenuActionChange } from './extensions/table-menu/table-menu.component';

export const tableAnimation = trigger('tableAnimation', [
  transition('* => *', [
    query(':enter', style({ transform: 'translateX(-50%)', opacity: 0 }), {
      limit: 11,
      optional: true,
    }),
    query(
      ':enter',
      stagger('0.01s', [
        animate(
          '0.5s ease',
          style({ transform: 'translateX(0%)', opacity: 1 })
        ),
      ]),
      { limit: 11, optional: true }
    ),
  ]),
]);

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dynamic-mat-table',
  templateUrl: './dynamic-mat-table.component.html',
  styleUrls: ['./dynamic-mat-table.component.scss'],
  animations: [tableAnimation],
})
export class DynamicMatTableComponent<T extends TableRow>
  extends TableCoreDirective<T>
  implements OnInit, AfterViewInit {
  @ViewChild('printRef', { static: true })
  printRef: TemplateRef<any>;
  @ViewChild('printContentRef', { static: true })
  printContentRef: ElementRef;
  @ViewChildren(HeaderFilterComponent)
  headerFilterList: QueryList<HeaderFilterComponent>;

  printing = true;
  printTemplate: TemplateRef<any> = null;
  resizeColumn: ResizeColumn = new ResizeColumn();

  // mouse resize
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    public languagePack: TableIntl,
    public tableService: TableService
  ) {
    super(tableService);

    this.resizeColumn.widthUpdate.subscribe((data) => {
      this.columns[data.i].width = data.w;
      this.tableSetting.columnSetting[data.i].width = data.w;
      this.refreshTableSetting();
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.dataSource.sort.sortChange.subscribe((resp) => {
      this.pagination.pageIndex = 0;
      console.log(this.pagination);
    });
    this.dataSource.dataOfRange$.subscribe((data) => {
      // console.log('dataOfRange');
    });
  }

  ellipsis(cellRef) {
    console.log(cellRef.clientHeight);
    console.log(cellRef.scrollHeight);
    if (cellRef.clientHeight > this.rowHeight) {
      cellRef.style.maxHeight = '48px';
    }
  }

  filter_OnChanged(column: TableField<T>, filter: AbstractFilter[]) {
    this.pending = true;
    this.dataSource.setFilter(column.name, filter).subscribe(() => {
      this.pending = false;
    });
  }

  menuActionChange(e: MenuActionChange) {
    if (e.type === 'TableSetting') {
      this.saveSetting(e.data, false);
    } else if (e.type === 'Download') {
      if (e.data === 'CSV') {
        this.tableService.exportToCsv(
          this.dataSource.filteredData,
          this.rowSelection
        );
      } else if (e.data === 'JSON') {
        this.tableService.exportToJson(this.dataSource.filteredData);
      }
    } else if (e.type === 'FilterClear') {
      this.dataSource.clearFilter();
      this.headerFilterList.forEach((hf) => hf.clearColumn_OnClick());
    } else if (e.type === 'Print') {
      this.printConfig.displayedFields = this.columns
        .filter((c) => isNull(c.print) || c.print === true)
        .map((o) => o.name);
      this.printConfig.title = this.printConfig.title || this.tableName;
      this.printConfig.direction = this.tableSetting.direction || 'ltr';
      this.printConfig.columns = this.tableColumns;
      this.printConfig.data = this.dataSource.filteredData;
      const params = this.dataSource.toTranslate();
      this.printConfig.tablePrintParameters = [];
      params.forEach((item) => {
        this.printConfig.tablePrintParameters.push(item);
      });

      this.dialog.open(PrintTableDialogComponent, {
        width: '90vw',
        data: this.printConfig,
      });
    } else if (e.type === 'SaveSetting') {
      this.saveSetting(null, true);
    }
  }

  rowActionChange(e: RowActionMenu, row) {
    console.log(e, row);

    window.requestAnimationFrame(() => {
      this.rowActionMenuChange.emit({ actionItem: e, rowItem: row });
    });
  }

  doRendering(e) {
    this.pending = false;
    if (this.viewport.getViewportSize() === 0) {
      // console.log('zero');
    }
  }

  rowOnClick(row) {
    if (this.selection !== 'none' ) {
      this.rowSelection.toggle(row);
    }
    this.rowClick.emit(row);
  }

  pagination_onChange(e: TablePagination) {
    console.log(e);
    this.pending = true;
    this.dataSource.refreshFilterPredicate(); // pagination Bugfixed
    this.paginationChange.emit(e);
  }

  /////////////////////////////////////////////////////////////////

  onResizeColumn(event: any, index: number, type: 'left' | 'right') {
    this.resizeColumn.resizeHandler = type;
    this.resizeColumn.startX = event.pageX;
    console.log(this.resizeColumn.resizeHandler, this.resizeColumn.startX);
    if (this.resizeColumn.resizeHandler === 'right') {
      this.resizeColumn.startWidth = event.target.parentElement.clientWidth;
      this.resizeColumn.currentResizeIndex = index;
    } else {
      if (event.target.parentElement.previousElementSibling === null) {
        // for first column not resize
        return;
      } else {
        this.resizeColumn.startWidth =
          event.target.parentElement.previousElementSibling.clientWidth;
        this.resizeColumn.currentResizeIndex = index;
      }
    }
    event.preventDefault();
    this.mouseMove(index);
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen(
      'document',
      'mousemove',
      (event) => {
        if (this.resizeColumn.resizeHandler !== null && event.buttons) {
          const rtl = this.direction === 'rtl' ? -1 : 1;
          let width = 0;
          if (this.resizeColumn.resizeHandler === 'right') {
            const dx = event.pageX - this.resizeColumn.startX;
            width = this.resizeColumn.startWidth + rtl * dx;
          } else {
            const dx = this.resizeColumn.startX - event.pageX;
            width = this.resizeColumn.startWidth - rtl * dx;
          }
          if (
            this.resizeColumn.currentResizeIndex === index &&
            width > this.minWidth
          ) {
            this.resizeColumn.widthUpdate.next({
              i: index - (this.resizeColumn.resizeHandler === 'left' ? 1 : 0),
              w: width,
            });
          }
        }
      }
    );
    this.resizableMouseup = this.renderer.listen(
      'document',
      'mouseup',
      (event) => {
        if (this.resizeColumn.resizeHandler !== null) {
          this.resizeColumn.resizeHandler = null;
          this.resizeColumn.currentResizeIndex = -1;
          // this.resizableMousemove();
          // this.resizableMouseup();
        }
      }
    );
  }

  setColumnWidth(column: any) {
    const columnEls = Array.from(
      document.getElementsByClassName('mat-column-' + column.field)
    );
    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = column.width + 'px';
    });
  }

  setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.columns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  onRowClick(row) {
    this.selection === 'none' ? null : this.rowSelection.toggle(row);
    this.onRowEvent.emit(row);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   console.log(event);
  //   this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  // }
}
