import { TableRow, TableSelectionMode } from '../models/table-row.model';
import { TableVirtualScrollDataSource } from './table-data-source';
import { MatSort, MatTable, MatPaginator } from '@angular/material';
import { ViewChild, Input, OnInit, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { TableMenu } from '../models/table-menu.model';
import { TableField } from '../models/table-field.model';
import { titleCase } from '../utilies/text.utility';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { AbstractFilter } from '../dynamic-mat-table/extensions/filter/compare/abstract-filter';
import { TableService } from '../dynamic-mat-table/dynamic-mat-table.service';
import { HeaderFilterComponent } from '../dynamic-mat-table/extensions/filter/header-filter.component';
import { TablePagination } from '../models/table-pagination.model';


export class TableCore<T extends TableRow> {
  // Variables //
  progressColumn: string[] = [];
  displayedColumns: string[] = [];
  private selectionRow: TableSelectionMode;
  private menus: TableMenu[] = [];
  public tableColumns: TableField<T>[];
  private previousIndex: number; // Drag & Drop
  public tvsDataSource: TableVirtualScrollDataSource<T>;
  private tableSelection = new SelectionModel<T>(true, []);
  private tablePagination: TablePagination;
  public tablePagingEnable = false;
  public viewportClass: 'viewport' | 'viewport-with-pagination';
  private matPaginator: MatPaginator;
  /**************************************** Refrence Variables ***************************************/
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(HeaderFilterComponent) headerFilterList: QueryList<HeaderFilterComponent>;
  @ViewChild(MatPaginator, { static: false })
  set paginator(mp: MatPaginator) {
    this.matPaginator = mp;
    this.updateDatasource();
  }

  /************************************ Input & Output parameters ************************************/
  @Input()
  get pagingEnable() {
      return this.tablePagingEnable;
  }
  set pagingEnable(value: boolean) {
    this.tablePagingEnable = value;
    this.updateDatasource();
  }

  @Input()
  get pagination() {
    return  this.tablePagination;
  }
  set pagination(value: TablePagination) {
    if (value !== null) {
      this.tablePagination = value;
    }
    this.tablePagination.pageSizeOptions = (this.tablePagination.pageSizeOptions === null ?
                                            [5, 10, 25, 100] : this.tablePagination.pageSizeOptions);
    this.tablePagination.pageSize = (this.tablePagination.pageSize === null ?
                                      this.tablePagination.pageSizeOptions[0] : this.tablePagination.pageSize);
    this.updateDatasource();
  }
  @Output() paginationChange: EventEmitter<TablePagination> = new EventEmitter();
  @Input()
  get rowSelection() {
    return  this.tableSelection;
  }
  set rowSelection(value: SelectionModel<T>) {
    this.tableSelection = value;
  }
  @Output() rowSelectionChange: EventEmitter<SelectionModel<T>> = new EventEmitter();
  @Input()
  get selection() {
    return this.selectionRow;
  }
  set selection(selection: TableSelectionMode) {
    this.selectionRow = selection || 'none';
    this.tableSelection = this.selectionRow === 'none' ? null : new SelectionModel<T>(this.selectionRow === 'multi', []);
    this.setDisplayedColumns();
    this.rowSelectionChange.emit(this.tableSelection);
  }

  @Input()
  get tableName() {
    return this.tableService.tableName;
  }
  set tableName(value: string) {
    this.tableService.tableName = value;
  }

  @Input() showNoData = true;
  @Input()
  get showProgress() {
    return this.progressColumn.length > 0;
  }
  set showProgress(value: boolean) {
    this.progressColumn = [];
    if (value === true) {
      this.progressColumn.push('progress');
    }
  }

  @Input()
  get dataSource() {
    return this.tvsDataSource;
  }
  set dataSource(value: TableVirtualScrollDataSource<T>) {
    if (value != null) {
      this.tvsDataSource = value;
    } else {
      this.tvsDataSource = new TableVirtualScrollDataSource<T>();
    }
    this.updateDatasource();
  }

  @Input() pending: boolean;
  @Input() rowHeight = 48;
  @Input() headerHeight = 56;
  @Input() footerHeight = 48;
  @Input() headerEnable = true;
  @Input() footerEnable = false;
  @Input() sticky: boolean;
  @Input()
  get menu() {
    return this.menus;
  }
  set menu(menus: TableMenu[]) {
    this.menus = menus;
  }
  @Input()
  get columns() {
    return this.tableColumns;
  }
  set columns(fields: TableField<T>[]) {
    fields.forEach(f => {
      f.header = f.header ? f.header : titleCase(f.name);
    });
    this.tableColumns = fields;
    this.setDisplayedColumns();
  }

  constructor(public tableService: TableService) {
    this.showProgress = true;
  }

  /**************************************** Methods **********************************************/
  updateDatasource() {
    // console.log('oo', this.tvsDataSource.paginator);

    this.viewportClass = 'viewport';
    if ( this.tablePagingEnable === true && this.tvsDataSource !== null && this.tvsDataSource !== undefined) {
      this.tvsDataSource.sort = this.sort;
      this.tvsDataSource.paginator = this.matPaginator;
      this.viewportClass = 'viewport-with-pagination';
      this.tablePagination.length = this.tvsDataSource.data.length;
    } else if ( this.tablePagingEnable === false && this.tvsDataSource !== null && this.tvsDataSource !== undefined) {
      this.tvsDataSource.paginator = null;
    }
  }

  clear() {
    this.viewport.scrollTo({ top: 0, behavior: 'auto' });
    this.dataSource = new TableVirtualScrollDataSource<T>([]);
  }

  trackBy = (_: number, item: any) => {
    return item.Id;
  }

  setDisplayedColumns() {
    if (this.columns) {
      this.displayedColumns = [];
      this.columns.forEach((colunm, index) => {
        colunm.index = index;
        if (colunm.hidden === undefined || colunm.hidden === false) {
          this.displayedColumns.push(colunm.name);
        }
        // this.displayedColumns[index] = colunm.name;
      });

      if (this.selection === 'multi' || this.selection === 'single') {
        this.displayedColumns = ['table-select', ...this.displayedColumns];
      }
      this.displayedColumns.push('table-menu');
    }
  }

  filter(field: string, filter: AbstractFilter[]): void {
    console.log(field, filter);
    // this.dataSource.setFilter({ key, predicate, valueFn });
  }

  /************************************ Drag & Drop Column *******************************************/

  dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
    const offset = this.viewport.measureScrollOffset();
  }

  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      this.moveColumn(this.previousIndex, index);
    }
  }

  moveColumn(from: number, to: number) {
    window.requestAnimationFrame(() => {
      moveItemInArray(this.columns, from, to);
      this.refreshColumn(this.columns);
    });
  }

  refreshColumn(columns: TableField<T>[]) {
    const currentOffset = this.viewport.measureScrollOffset();
    this.columns = columns;
    this.setDisplayedColumns();
    setTimeout(() => this.viewport.scrollTo({ top: currentOffset, behavior: 'auto' }), 0);
  }


  /************************************ Selection Table Row *******************************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.tableSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.rowSelection.clear() :
      this.dataSource.data.forEach(row => this.rowSelection.select(row));
    this.rowSelectionChange.emit(this.rowSelection);
  }

  onRowSelectionChange(e, row) {
    console.log(e);
    if (e) {
      this.rowSelection.toggle(row);
      this.rowSelectionChange.emit(this.rowSelection);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.rowSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
