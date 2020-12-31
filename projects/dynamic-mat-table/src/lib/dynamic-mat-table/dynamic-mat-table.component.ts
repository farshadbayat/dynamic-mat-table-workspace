import { Component, OnInit, AfterViewInit, ViewChildren,
         QueryList, ElementRef, ViewChild, TemplateRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, Input} from '@angular/core';
import { TableCoreDirective } from '../cores/table.core.directive';
import { TableService } from './dynamic-mat-table.service';
import { RowActionMenu, TableRow } from '../models/table-row.model';
import { TableField } from '../models/table-field.model';
import { AbstractFilter } from './extensions/filter/compare/abstract-filter';
import { TablePagination } from '../models/table-pagination.model';
import { HeaderFilterComponent } from './extensions/filter/header-filter.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintTableDialogComponent } from './extensions/print-dialog/print-dialog.component';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { ResizeColumn } from '../models/resize-column.mode';
import { TableIntl } from '../international/table-Intl';
import { MenuActionChange } from './extensions/table-menu/table-menu.component';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { isNullorUndefined } from '../cores/type';
import 'hammerjs';
import { TableSetting } from '../models/table-setting.model';
import { delay } from 'rxjs/operators';

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

export const expandAnimation = trigger('detailExpand', [
  state('collapsed', style({height: '0px', minHeight: '0'})),
  state('expanded', style({height: '*'})),
  transition('expanded <=> collapsed', animate('100ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dynamic-mat-table',
  templateUrl: './dynamic-mat-table.component.html',
  styleUrls: ['./dynamic-mat-table.component.scss'],
  animations: [tableAnimation, expandAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicMatTableComponent<T extends TableRow> extends TableCoreDirective<T> implements OnInit, AfterViewInit {
  @Input()
  get setting() {
    return this.tableSetting;
  }
  set setting(value: TableSetting) {    
    if ( !isNullorUndefined(value) ) {
      this.tableSetting.columnSetting = value.columnSetting === undefined ? this.tableSetting.columnSetting : value.columnSetting;
      this.tableSetting.visibleTableMenu = value.visibleTableMenu === undefined ? this.tableSetting.visibleTableMenu : value.visibleTableMenu;
      this.tableSetting.direction = value.direction ? this.tableSetting.direction : value.direction;
      this.tableSetting.visibaleActionMenu = value.visibaleActionMenu ? this.tableSetting.visibaleActionMenu : value.visibaleActionMenu;      
      this.setDisplayedColumns();
    }
  }
  
  @ViewChild('printRef', { static: true }) printRef !: TemplateRef<any>;
  @ViewChild('printContentRef', { static: true }) printContentRef !: ElementRef;
  @ViewChildren(HeaderFilterComponent) headerFilterList !: QueryList<HeaderFilterComponent>;
  private dragDropData = {dragColumnIndex: -1, dropColumnIndex: -1};
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
    public tableService: TableService,
    private cd: ChangeDetectorRef,
    // private fixedSizeTableVirtualScrollStrategy: FixedSizeTableVirtualScrollStrategy
  ) {
    super(tableService); 

    this.resizeColumn.widthUpdate.pipe(delay(100)).subscribe((data) => {
      this.columns[data.i].width = data.w;
      this.tableSetting.columnSetting[data.i].width = data.w;
      this.refreshGrid();
    });
  }

  ngOnInit() {
    this.viewport.renderedRangeStream.subscribe( t => {
      // in expanding row scrolling make not good apperance therefor close it.
      if (this.expandedElement && this.expandedElement.option && this.expandedElement.option.expand) {
        // console.log('clear', t); 
        // this.expandedElement.option.expand = false;
        // this.expandedElement = null;
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort.sortChange.subscribe((resp) => {
      this.pagination.pageIndex = 0;
    });
    this.dataSource.dataOfRange$.subscribe((data) => {
      // console.log('dataOfRange');
    });
  }

  public refreshGrid() {    
    this.cd.markForCheck();
    this.refreshTableSetting();
  }

  // TO DO
  ellipsis(cellRef) {
    console.log(cellRef.clientHeight);
    console.log(cellRef.scrollHeight);
    if (cellRef.clientHeight > this.rowHeight) {
      cellRef.style.maxHeight = '48px';
    }
  }

  cellClass(option, column) {
    let clas = null;
    if (option && column.name) {
      clas = option[column.name] ? option[column.name].style : null;
    }
    
    if ( clas === null) {
      return column.cellClass;
    } else {
      return {...clas, ...column.cellClass};
    }
  }

  cellStyle(option, column) {
    let style = null;
    if (option && column.name) {
      style = option[column.name] ? option[column.name].style : null;
    }
    
    if ( style === null) {
      return column.cellStyle;
    } else {
      return {...style, ...column.cellStyle};
    }
  }

  cellIcon(option, cellName) {
    if (option && cellName) {
      return option[cellName] ? option[cellName].icon : null;
    } else {
      return null;
    }    
  }

  filter_onChanged(column: TableField<T>, filter: AbstractFilter[]) {
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
        .filter((c) => isNullorUndefined(c.print) || c.print === true)
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
    window.requestAnimationFrame(() => {
      // actionItem: e, rowItem: row
      this.rowActionMenuChange.emit({actionItem: e, rowItem: row });
    });
  }

  doRendering(e) {
    this.pending = false;
    if (this.viewport.getViewportSize() === 0) {
      // console.log('zero');
    }
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
    // console.log(this.resizeColumn.resizeHandler, this.resizeColumn.startX);
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
          if ( this.resizeColumn.currentResizeIndex === index && width > this.minWidth ) {
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

  public expandRow(rowIndex: number, mode: boolean = true) {    
    if( rowIndex === null || rowIndex === undefined) {
      throw 'Row index is not defined.';      
    }
    if (this.expandedElement === this.dataSource.allData[rowIndex]) {
      this.expandedElement.option.expand = mode;    
      this.expandedElement = this.expandedElement === this.dataSource.allData[rowIndex] ? null : this.dataSource.allData[rowIndex];    
    } else {
      if (this.expandedElement && this.expandedElement !== this.dataSource.allData[rowIndex]) {
        this.expandedElement.option.expand = false;      
      }
      this.expandedElement = null;      
      if (mode === true) {    
        // this.viewport.scrollToIndex(rowIndex, 'smooth');      
        // setTimeout( () => {
        //   this.expandedElement = this.expandedElement === this.dataSource.allData[rowIndex] ? null : this.dataSource.allData[rowIndex];    
        //   if (this.expandedElement.option === undefined || this.expandedElement.option === null) {
        //     this.expandedElement.option = { expand: false};
        //   }
        //   this.expandedElement.option.expand = true;
        //   this.refreshGrid();
        // }, 300);
        this.expandedElement = this.expandedElement === this.dataSource.allData[rowIndex] ? null : this.dataSource.allData[rowIndex];    
        if (this.expandedElement.option === undefined || this.expandedElement.option === null) {
          this.expandedElement.option = { expand: false};
        }
        this.expandedElement.option.expand = true;
      }
    }    
  }

  onCellClick(e, row, column) {
    if (this.selection && this.selection !== 'none') {
      this.onRowSelectionChange(e, row);
    }
    this.onRowEvent.emit({ event: e, sender: {row: row, column: column} });
  }

  onRowDblClick(e, row) {    
    this.onRowEvent.emit({ event: e, sender: {row: row} });
  }

  /************************************ Drag & Drop Column *******************************************/

  dragStarted(event: CdkDragStart) {
    console.log(event);    
    // debugger
    // this.dragDropData.dragColumnIndex = event.source.;
  }

  dropListDropped(event: CdkDragDrop<string[]>) {    
    if (event) {
      this.dragDropData.dropColumnIndex = event.currentIndex;
      this.moveColumn(event.previousIndex, event.currentIndex);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    // updates moved data and table, but not dynamic if more dropzones
    // this.dataSource.data = clonedeep(this.dataSource.data);
  }
  /************************************  *******************************************/
 
  copyProperty(from: any, to: any) {
    const keys = Object.keys(from);
    keys.forEach( key => {
      if (from[key] !== undefined && from[key] === null) {
        to[key] = Array.isArray(from[key]) ? Object.assign([], from[key]) : Object.assign({}, from[key]);
      }
    });
  }
}


