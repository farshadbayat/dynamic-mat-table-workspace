import { IEvent, IRowActionMenuEvent, RowActionMenu, RowOption, TableRow, TableSelectionMode } from '../models/table-row.model';
import { TableVirtualScrollDataSource } from './table-data-source';
import { ViewChild, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { TableField } from '../models/table-field.model';
import { titleCase } from '../utilies/text.utils';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { TableService } from '../dynamic-mat-table/dynamic-mat-table.service';
import { TablePagination } from '../models/table-pagination.model';
import { PrintConfig } from '../models/print-config.model';
import { TableSetting, Direction } from '../models/table-setting.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { Directive } from '@angular/core';
import { clone, getObjectProp, isNullorUndefined } from './type';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[core]'
})
export class TableCoreDirective<T extends TableRow> {

  @ViewChild(MatSort, { static: true }) // sort: MatSort;
  set sort(value: MatSort) {
    if (value && value !== null) {
      if (this.tvsDataSource === undefined || this.tvsDataSource === null) {
        this.tvsDataSource = new TableVirtualScrollDataSource<T>([]);
      }
      this.tvsDataSource.sort = value;
    }
  }

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (!isNullorUndefined(value) && this.tablePagingMode === 'client') {
      if (this.tvsDataSource === undefined || this.tvsDataSource === null) {
        this.tvsDataSource = new TableVirtualScrollDataSource<T>([]);
      }
      (this.tvsDataSource as any)._paginator = value;
    }
    this.updatePagination();
  }

  @HostBinding('style.direction')
  get direction(): Direction {
    return this.tableSetting.direction;
  }
  set direction(value: Direction) {
    this.tableSetting.direction = value;
  }

  

  @Input()
  get pagingMode() {
    return this.tablePagingMode;
  }
  set pagingMode(value: 'none' | 'client' | 'server') {
    this.tablePagingMode = value;
    this.updatePagination();
  }

  @Input()
  get pagination() {
    return this.tablePagination;
  }
  set pagination(value: TablePagination) {
    if (value && value !== null) {
      this.tablePagination = value;
      if ( isNullorUndefined(this.tablePagination.pageSizeOptions)) {
        this.tablePagination.pageSizeOptions = [5, 10, 25, 100];
      }
      if ( isNullorUndefined(this.tablePagination.pageSizeOptions)) {
        this.tablePagination.pageSize = this.tablePagination.pageSizeOptions[0];
      }
      this.updatePagination();
    }
  }

  @Input()
  get rowSelection() {
    return this.tableSelection;
  }
  set rowSelection(value: SelectionModel<T>) {
    this.tableSelection = value;
    // console.log(this.tableSelection);
    
  }

  @Input()
  get selection() {
    return this.rowSelectionMode;
  }
  set selection(selection: TableSelectionMode) {
    this.rowSelectionMode = selection || 'none';
    this.tableSelection = this.rowSelectionMode === 'none' ? null : new SelectionModel<T>(this.rowSelectionMode === 'multi', []);
    this.setDisplayedColumns();    
    //this.rowSelectionChange.emit(this.tableSelection);
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

  @Input()
  get dataSource() {
    return this.tvsDataSource;
  }
  set dataSource(value: TableVirtualScrollDataSource<T>) {
    this.clear();
    if (value && value != null) {
      this.tvsDataSource.data = value.data;
      // this.cdr.detectChanges();
    }
  }

  public expandColumn = [];
  private expandComponent_: any;
  @Input()
  get expandComponent(): any {
    return this.expandComponent_;
  }
  set expandComponent(value: any) {
    this.expandComponent_ = value;
    if (this.expandComponent_ !== null && this.expandComponent_ !== undefined) {
      this.expandColumn = ['expandedDetail'];
    } else {
      this.expandColumn = [];
    }
  }

  @Input() public rowActionMenu: RowActionMenu[];

  // @Input()
  // get menu() {
  //   return this.menus;
  // }
  // set menu(menus: TableMenu[]) {
  //   this.menus = menus;
  // }

  @Input() defaultWidth: number = null;

  @Input() minWidth = 100;

  @Input()
  get columns() {
    return this.tableColumns;
  }
  set columns(fields: TableField<T>[]) {
    (fields || []).forEach((f, i) => {
      const settingFields = (this.tableSetting.columnSetting || []).filter(s => s.name === f.name);
      const settingField = settingFields.length > 0 ? settingFields[0] : null;
      // default value for fields
      f.header = f.header ? f.header : titleCase(f.name);
      f.display = getObjectProp('display', 'visible' , settingField, f ); // f.display ? f.display : 'visible';
      f.filter = getObjectProp('filter', 'client-side' , settingField, f ); // f.filter ? f.filter : 'client-side';
      f.sort = getObjectProp('sort', 'client-side' , settingField, f ); // f.sort ? f.sort : 'client-side';
      f.sticky = getObjectProp('sticky', 'none' , settingField, f ); // f.sticky ? f.sticky : 'none';
      f.width =  getObjectProp('width', this.defaultWidth , settingField, f ); // f.width ? f.width : this.defaultWidth;
    });
    this.tableColumns = fields;
    // console.log('pp');
    if (isNullorUndefined(this.tableSetting.columnSetting) ) {
      this.tableSetting.columnSetting = clone(fields);
    }
    this.setDisplayedColumns();
  }

  /*************************************** I/O parameters *********************************/
  @Input() printConfig: PrintConfig = {};
  @Input()
  get dir(): 'ltr' | 'rtl' {
    return this.direction;
  }
  set dir( value: 'ltr' | 'rtl') {
    this.direction = value;
    // update in menu
    this.tableSetting = {
      direction: value,
      visibaleActionMenu: this.tableSetting.visibaleActionMenu || null,
      columnSetting: this.tableColumns
    };
  }
  @Input() sticky: boolean;
  @Input() pending: boolean;
  @Input() rowHeight = 48;
  @Input() headerHeight = 56;
  @Input() footerHeight = 48;
  @Input() headerEnable = true;
  @Input() footerEnable = false;
  @Input() showNoData: boolean;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onRowEvent: EventEmitter<IEvent> = new EventEmitter();
  @Output() settingChange: EventEmitter<any> = new EventEmitter();
  @Output() paginationChange: EventEmitter<TablePagination> = new EventEmitter();
  //@Output() rowSelectionChange: EventEmitter<SelectionModel<T>> = new EventEmitter();
  @Output() rowActionMenuChange: EventEmitter<IRowActionMenuEvent<any>> = new EventEmitter();
  
  /*************************************** Expand Row *********************************/
  expandedElement: TableRow | null;

  constructor(public tableService: TableService) {
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
  // private menus: TableMenu[] = [];
  public tableColumns: TableField<T>[];
  public tvsDataSource: TableVirtualScrollDataSource<T>;

  private rowSelectionMode: TableSelectionMode;
  private tableSelection = new SelectionModel<T>(true, []);
  private tablePagination: TablePagination = { };
  public tablePagingMode: 'none' | 'client' | 'server'  = 'none';
  public viewportClass: 'viewport' | 'viewport-with-pagination' = 'viewport-with-pagination';
  tableSetting: TableSetting;

  /**************************************** Refrence Variables ***************************************/
  @ViewChild(MatTable, { static: true }) table !: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport !: CdkVirtualScrollViewport;  
  /**************************************** Methods **********************************************/

  refreshTableSetting() {
    this.tableSetting = clone(this.tableSetting);
  }

  updatePagination() {
    window.requestAnimationFrame(() => {
      if (this.tablePagingMode === 'client' || this.tablePagingMode === 'server') {
        this.viewportClass = 'viewport-with-pagination';
        if ( !isNullorUndefined(this.tvsDataSource.paginator)) {
          let dataLen = this.tvsDataSource.paginator.length;
          if (!isNullorUndefined(this.tablePagination.length) && this.tablePagination.length > dataLen) {
            dataLen = this.tablePagination.length;
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
    });
  }

  public clear() {
    if (this.dataSource && this.dataSource !== null) {
      if (this.viewport) {
        this.viewport.scrollTo({ top: 0, behavior: 'auto' });
      }
      this.dataSource.clearData();
      this.expandedElement = null;
    }
    if(this.tableSelection) {
      this.tableSelection.clear();
    }
    // this.dataSource = new TableVirtualScrollDataSource<T>([]);
  }  

  trackBy = (_: number, item: any) => {
    return item.Id;
  }

  setDisplayedColumns() {
    if (this.columns) {
      this.displayedColumns = [];
      this.columns.forEach((colunm, index) => {
        colunm.index = index;
        if (colunm.display === undefined || colunm.display === 'visible' || colunm.display === 'prevent-hidden') {
          this.displayedColumns.push(colunm.name);
        }
        // this.displayedColumns[index] = colunm.name;
      });

      if (this.selection === 'multi' || this.selection === 'single') {
        this.displayedColumns = ['table-select', ...this.displayedColumns];
      }
      if (this.tableSetting.visibleTableMenu !== false) {
        this.displayedColumns.push('table-menu');
      }
    }
    this.updatePagination();
  }


  /************************************ Drag & Drop Column *******************************************/ 

  moveColumn(from: number, to: number) {
    window.requestAnimationFrame(() => {
      moveItemInArray(this.columns, from, to);
      this.refreshColumn(this.columns);
    });
  }

  refreshColumn(columns: TableField<T>[]) {
    if (this.viewport) {
      const currentOffset = this.viewport.measureScrollOffset();
      this.columns = columns;
      this.setDisplayedColumns();
      setTimeout(() => this.viewport.scrollTo({ top: currentOffset, behavior: 'auto' }), 0);
    }
  }

  saveSetting(tableSetting: TableSetting, raiseEvent: boolean = false) {
    if (tableSetting !== null) {
      this.tableSetting = tableSetting;
      this.refreshColumn(tableSetting.columnSetting);
    }
    if (raiseEvent === true) {
      this.settingChange.emit(this.tableSetting);
    }
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
    this.onRowEvent.emit({ event: 'MasterSelectionChange', sender:  this.tableSelection});
  }

  onRowSelectionChange(e: any, row: T) {
    if (e) {
      this.rowSelection.toggle(row);
      this.onRowEvent.emit({ event: 'RowSelectionChange', sender:  this.tableSelection});
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

