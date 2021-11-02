import { IRowEvent, IRowActionMenuEvent, TableRow, TableSelectionMode, ITableEvent } from '../models/table-row.model';
import { TableVirtualScrollDataSource } from './table-data-source';
import { ViewChild, Input, Output, EventEmitter, HostBinding, ChangeDetectorRef, ElementRef } from '@angular/core';
import { TableField } from '../models/table-field.model';
import { titleCase } from '../utilies/text.utils';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { TableService } from '../dynamic-mat-table/dynamic-mat-table.service';
import { TablePagination, TablePaginationMode } from '../models/table-pagination.model';
import { PrintConfig } from '../models/print-config.model';
import { TableSetting, Direction } from '../models/table-setting.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Directive } from '@angular/core';
import { clone, getObjectProp, isNullorUndefined } from './type';
import { TableScrollStrategy } from './fixed-size-table-virtual-scroll-strategy';
import { ContextMenuItem } from '../models/context-menu.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[core]'
})
export class TableCoreDirective<T extends TableRow> {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() public dataSource: BehaviorSubject<any[]>;
  @Input() backgroundColor: string = null;
  @Input()
  @HostBinding('style.direction')
  get direction(): Direction {
    return this.tableSetting?.direction;
  }
  set direction(value: Direction) {
    this.tableSetting.direction = value;
  }

  @Input() contextMenuItems: ContextMenuItem[] = [];
  @Input()
  get ScrollStrategyType() {
    return this.tableSetting.scrollStrategy;
  }
  set ScrollStrategyType(value: TableScrollStrategy) {
    this.viewport['_scrollStrategy'].scrollStrategyMode = value;
    this.tableSetting.scrollStrategy = value;
  }

  @Input()
  get pagingMode() {
    return this.tablePagingMode;
  }
  set pagingMode(value: TablePaginationMode) {
    this.tablePagingMode = value;
    this.updatePagination();
  }

  @Input()
  get pagination() {
    return this._tablePagination;
  }
  set pagination(value: TablePagination) {
    if (value && value !== null) {
      this._tablePagination = value;
      if ( isNullorUndefined(this._tablePagination.pageSizeOptions)) {
        this._tablePagination.pageSizeOptions = [5, 10, 25, 100];
      }
      if ( isNullorUndefined(this._tablePagination.pageSizeOptions)) {
        this._tablePagination.pageSize = this._tablePagination.pageSizeOptions[0];
      }
      this.updatePagination();
    }
  }

  @Input()
  get rowSelectionModel() {
    return this._rowSelectionModel;
  }
  set rowSelectionModel(value: SelectionModel<T>) {
    if (!isNullorUndefined(value)) {
      console.log(value);
      if (this._rowSelectionMode && value && this._rowSelectionMode !== 'none') {
        this._rowSelectionMode = (value.isMultipleSelection() === true ? 'multi': 'single');
      }
      this._rowSelectionModel = value;
    }
  }

  @Input()
  get rowSelectionMode() {
    return this._rowSelectionMode;
  }
  set rowSelectionMode(selection: TableSelectionMode) {
    selection = selection || 'none';
    const isSelectionColumn = (selection === 'single' || selection === 'multi');
    if( this._rowSelectionModel === null || (this._rowSelectionModel.isMultipleSelection() === true && selection === 'single') ||
       (this._rowSelectionModel.isMultipleSelection() === false && selection === 'multi')) {
      this._rowSelectionModel = new SelectionModel<T>(selection === 'multi', []);
    }
    if(this.displayedColumns?.length > 0 && !isSelectionColumn && this.displayedColumns[0] === 'row-checkbox') {
      this.displayedColumns.shift();
    } else if(this.displayedColumns?.length > 0 && isSelectionColumn && this.displayedColumns[0] !== 'row-checkbox') {
      this.displayedColumns.unshift('row-checkbox');
    }
    this._rowSelectionMode = selection;
  }

  @Input()
  get tableName() {
    return this.tableService.tableName;
  }
  set tableName(value: string) {
    this.tableService.tableName = value;
  }

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

  protected initSystemField(data: any[]) {
    if(data) {
      data = data.map( (item, index) => {
        item.id = index ;
        item.option = item.option || {};
        return item;
      });
    }
  }

  public expandColumn = [];
  private _expandComponent: any;
  @Input()
  get expandComponent(): any {
    return this._expandComponent;
  }
  set expandComponent(value: any) {
    this._expandComponent = value;
    if (this._expandComponent !== null && this._expandComponent !== undefined) {
      this.expandColumn = ['expandedDetail'];
    } else {
      this.expandColumn = [];
    }
  }

  @Input() public rowContextMenuItems: ContextMenuItem[];
  @Input() defaultWidth: number = null;
  @Input() minWidth = 120;
  @Input()
  get columns() {
    return this.tableColumns;
  }
  set columns(fields: TableField<T>[]) {
    (fields || []).forEach((f, i) => {
      // key name error //
      if (f.name.toLowerCase() === 'id') {
        throw 'Field name is reserved.["id"]';
      }
      const settingFields = (this.tableSetting.columnSetting || []).filter(s => s.name === f.name);
      const settingField = settingFields.length > 0 ? settingFields[0] : null;
      /* default value for fields */
      f.printable = f.printable || true;
      f.exportable = f.exportable || true;
      f.toExport = f.toExport || ((row, type) => typeof row === 'object' ? row[f.name] : '');
      f.toPrint = (row) =>  typeof row === 'object' ? row[f.name] : '';
      f.enableContextMenu = f.enableContextMenu || true;
      f.header = f.header || titleCase(f.name);
      f.display = getObjectProp('display', 'visible' , settingField, f );
      f.filter = getObjectProp('filter', 'client-side' , settingField, f );
      f.sort = getObjectProp('sort', 'client-side' , settingField, f );
      f.sticky = getObjectProp('sticky', 'none' , settingField, f );
      f.width =  getObjectProp('width', this.defaultWidth , settingField, f );
    });
    this.tableColumns = fields;
    this.updateColumn();
  }

  public updateColumn() {
    if (isNullorUndefined(this.tableSetting.columnSetting)) {
      this.tableSetting.columnSetting = clone(this.tableColumns);
    }
    this.setDisplayedColumns();
  }

  /*************************************** I/O parameters *********************************/
  @Input() printConfig: PrintConfig = {};
  @Input() sticky: boolean;
  @Input() pending: boolean;
  @Input() rowHeight = 48;
  @Input() headerHeight = 56;
  @Input() footerHeight = 48;
  @Input() headerEnable = true;
  @Input() footerEnable = false;
  @Input() showNoData: boolean;
  @Input() showReload: boolean;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onTableEvent: EventEmitter<ITableEvent> = new EventEmitter();
  @Output() onRowEvent: EventEmitter<IRowEvent> = new EventEmitter();
  @Output() settingChange: EventEmitter<any> = new EventEmitter();
  @Output() paginationChange: EventEmitter<TablePagination> = new EventEmitter();
  public noData: boolean = true;

  //**this event is deperact and move to onRowEvent */
  // @Output() rowActionMenuChange: EventEmitter<IRowActionMenuEvent<any>> = new EventEmitter();

  /*************************************** Expand Row *********************************/
  expandedElement: TableRow | null;

  constructor(public tableService: TableService, public cdr: ChangeDetectorRef) {
    this.showProgress = true;
    this.tableSetting = {
      direction: 'ltr',
      columnSetting: null,
      visibaleActionMenu: null
    };
  }

  // Variables //
  progressColumn: string[] = [];
  displayedColumns: string[] = [];
  displayedFooter: string[] = [];
  // private menus: TableMenu[] = [];
  public tableColumns: TableField<T>[];
  public tvsDataSource: TableVirtualScrollDataSource<T> = new TableVirtualScrollDataSource<T>([]);

  protected _rowSelectionMode: TableSelectionMode;
  private _rowSelectionModel = new SelectionModel<T>(true, []);
  private _tablePagination: TablePagination = { };
  public tablePagingMode: TablePaginationMode  = 'none';
  public viewportClass: 'viewport' | 'viewport-with-pagination' = 'viewport-with-pagination';
  tableSetting: TableSetting;

  /**************************************** Refrence Variables ***************************************/
  @ViewChild(MatTable, { static: true }) table !: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport !: CdkVirtualScrollViewport;
  /**************************************** Methods **********************************************/


  updatePagination() {
    if (isNullorUndefined(this.tvsDataSource)){
      return;
    }
    if (this.tablePagingMode === 'client-side' || this.tablePagingMode === 'server-side') {
      this.viewportClass = 'viewport-with-pagination';
      if ( !isNullorUndefined(this.tvsDataSource.paginator)) {
        let dataLen = this.tvsDataSource.paginator.length;
        if (!isNullorUndefined(this._tablePagination.length) && this._tablePagination.length > dataLen) {
          dataLen = this._tablePagination.length;
        }
        this.tvsDataSource.paginator.length = dataLen;
      }
    } else {
      this.viewportClass = 'viewport';
      if ((this.tvsDataSource as any)._paginator !== undefined) {
        delete (this.tvsDataSource as any)._paginator;
      }
    }
    this.tvsDataSource.refreshFilterPredicate();
  }

  public clear() {
    if (!isNullorUndefined(this.tvsDataSource)) {
      if (this.viewport) {
        this.viewport.scrollTo({ top: 0, behavior: 'auto' });
      }
      this.tvsDataSource.clearData();
      this.expandedElement = null;
    }
    if(this._rowSelectionModel) {
      this._rowSelectionModel.clear();
    }
    this.cdr.detectChanges()
  }

  swap(list: any[], x: number, y: number) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
  }

  setDisplayedColumns() {
    if (this.columns) {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.columns.forEach((colunm, index) => {
        colunm.index = index;
        if (colunm.display === undefined || colunm.display === 'visible' || colunm.display === 'prevent-hidden') {
          this.displayedColumns.push(colunm.name);
        }
      });
      if ((this._rowSelectionMode === 'multi' || this._rowSelectionMode === 'single') && this.displayedColumns.indexOf('row-checkbox') === -1) {
        this.displayedColumns.unshift('row-checkbox');
      }
      this.displayedFooter = this.columns.filter( item => item.footer !== null && item.footer !== undefined ).map(item => item.name);
      //bugfixed because of double header show
      // if ((this._rowSelectionMode === 'multi' || this._rowSelectionMode === 'single') && this.displayedColumns.indexOf('row-checkbox') === -1) {
      //   this.displayedColumns.unshift('row-checkbox');
      // }
      // setTimeout( () => {
      //   if ((this._rowSelectionMode === 'multi' || this._rowSelectionMode === 'single') && this.displayedColumns.indexOf('row-checkbox') === -1) {
      //     this.displayedColumns.unshift('row-checkbox');
      //   }
      // }, 0);

      if (this.tableSetting.visibleTableMenu !== false) {
        this.displayedColumns.push('table-menu');
      }
    }
    // this.updatePagination();
  }

  /************************************ Drag & Drop Column *******************************************/
  public refreshGrid() {
    this.cdr.detectChanges()
    this.refreshColumn(this.tableSetting.columnSetting);
    this.table.renderRows();
  }

  public moveRow(from: number, to: number) {
    if (from >= 0 && from < this.tvsDataSource.data.length  && to >= 0 && to < this.tvsDataSource.data.length ) {
      this.tvsDataSource.data[from].id = to;
      this.tvsDataSource.data[to].id = from;
      moveItemInArray(this.tvsDataSource.data, from, to);
      this.tvsDataSource.data = Object.assign([], this.tvsDataSource.data);
    }
  }

  moveColumn(from: number, to: number) {
    setTimeout(() => {
      moveItemInArray(this.columns, from, to);
      this.refreshColumn(this.columns);
    });
  }

  refreshColumn(columns: TableField<T>[]) {
    if (this.viewport) {
      const currentOffset = this.viewport.measureScrollOffset();
      this.columns = columns;
      // this.setDisplayedColumns();
      setTimeout(() => this.viewport.scrollTo({ top: currentOffset, behavior: 'auto' }), 0);
    }
  }

  // saveSetting(tableSetting: TableSetting, settingName: string, raiseEvent: boolean = false) {
  //   this.settingChange.emit({setting: this.tableSetting, settingName: settingName});
  //   // if (tableSetting !== null) {
  //   //   this.tableSetting = tableSetting;
  //   //   this.refreshColumn(tableSetting.columnSetting);
  //   // }
  //   // if (raiseEvent === true) {
  //   //   this.settingChange.emit({setting: this.tableSetting, settingName: settingName});
  //   // }
  // }

  /************************************ Selection Table Row *******************************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this._rowSelectionModel.selected.length;
    const numRows = this.tvsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this._rowSelectionModel.clear() :
      this.tvsDataSource.data.forEach(row => this._rowSelectionModel.select(row));
    this.onRowEvent.emit({ event: 'MasterSelectionChange', sender:  this._rowSelectionModel});
  }

  onRowSelectionChange(e: any, row: T) {
    if (e) {
      this._rowSelectionModel.toggle(row);
      this.onRowEvent.emit({ event: 'RowSelectionChange', sender:  this._rowSelectionModel});
    }
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: T): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this._rowSelectionModel.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  // }

}

