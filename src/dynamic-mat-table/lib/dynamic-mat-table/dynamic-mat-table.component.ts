import { Component, OnInit, Input, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { TableCore } from '../cores/table.core';
import { TableService } from './dynamic-mat-table.service';
import { LanguagePack } from '../models/language-pack.model';
import { TableRow } from '../models/table-row.model';
import { TableField } from '../models/table-field.model';
import { AbstractFilter } from './extensions/filter/compare/abstract-filter';
import { MenuActionChange } from './extensions/menu/table-menu.component';
import { TablePagination } from '../models/table-pagination.model';
import { HeaderFilterComponent } from './extensions/filter/header-filter.component';
import { isNull } from '../utilies/utils';
import { MatDialog } from '@angular/material';
import { PrintTableDialogComponent } from './extensions/print-dialog/print-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
          style({ transform: 'translateX(0%)', opacity: 1 }),
        ),
      ]),
      { limit: 11, optional: true },
    ),
  ]),
]);

@Component({
  selector: 'dynamic-mat-table',
  templateUrl: './dynamic-mat-table.component.html',
  styleUrls: ['./dynamic-mat-table.component.scss'],
  animations: [tableAnimation]
})
export class DynamicMatTableComponent<T extends TableRow> extends TableCore<T> implements OnInit, AfterViewInit {
  @ViewChildren(HeaderFilterComponent) headerFilterList: QueryList<HeaderFilterComponent>;
  @ViewChild('printRef', {static: true}) printRef: TemplateRef<any>;
  @ViewChild('printContentRef', {static: true}) printContentRef: ElementRef;

  printTemplate: TemplateRef<any> = null;

  public languageText: LanguagePack;
  printing = true;
  @Input()
  get languagePack() {
    return this.languageText;
  }
  set languagePack(language: LanguagePack) {
    this.languageText = language;
    this.tableService.loadLanguagePack(language);
  }

  constructor(public tableService: TableService, public dialog: MatDialog) {
    super(tableService);
    tableService.language.subscribe(languagePack => {
      this.languageText = languagePack;
    }
    );

  }

  ngAfterViewInit(): void {
    this.dataSource.sort.sortChange.subscribe(resp => {
      this.pagination.pageIndex = 0;
    });
    this.dataSource.dataOfRange$.subscribe(data => {
      // console.log('dataOfRange');
    });
  }

  ngOnInit() {
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
        this.tableService.exportToCsv(this.dataSource.filteredData, this.rowSelection);
      } else if (e.data === 'JSON') {
        this.tableService.exportToJson(this.dataSource.filteredData);
      }
    } else if (e.type === 'FilterClear') {
      this.dataSource.clearFilter();
      this.headerFilterList.forEach(hf => hf.clearColumn_OnClick());
    } else if (e.type === 'Print') {
      this.printTable.displayedFields = this.columns.filter( c => isNull(c.isPrintable) || c.isPrintable === true ).map( o => o.name);
      this.printTable.title = this.printTable.title || this.tableName;
      this.printTable.direction = this.tableSetting.direction || 'rtl';
      this.printTable.columns = this.tableColumns;
      this.printTable.data = this.dataSource.filteredData;
      const params = this.dataSource.toTranslate();
      this.printTable.tablePrintParameters = [];
      params.forEach( item => {
        this.printTable.tablePrintParameters.push(item);
      });

      this.dialog.open(PrintTableDialogComponent, {
        width: '90vw',
        data: this.printTable
      });
    } else if (e.type === 'SaveSetting') {
      this.saveSetting(null, true);
    }
  }

  doRendering(e) {
    this.pending = false;
    if ( this.viewport.getViewportSize() === 0) {
      // console.log('zero');
    }
  }

  pagination_onChange(e: TablePagination) {
    this.pending = true;
    this.dataSource.refreshFilterPredicate(); // pagination Bugfixed
    this.paginationChange.emit(e);
  }
}
