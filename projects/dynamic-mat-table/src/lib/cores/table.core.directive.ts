import { IRowEvent, IRowActionMenuEvent, RowActionMenu, RowOption, TableRow, TableSelectionMode, ITableEvent } from '../models/table-row.model';
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

const FULLSCREEN_STYLE = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; height: 100vh; z-index: 1000;';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[core]'
})
export class TableCoreDirective<T extends TableRow> {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // set paginator(value: MatPaginator) {
  //   if (!isNullorUndefined(value) && this.tablePagingMode === 'client-side') {
  //     if (isNullorUndefined(this.tvsDataSource)) {
  //       return;
  //       //this.tvsDataSource = new TableVirtualScrollDataSource<T>([]);
  //     }
  //     (this.tvsDataSource as any)._paginator = value;
  //   }
  //   this.updatePagination();
  // }

  // @Input()
  // @HostBinding('class')
  // get fullscreenClass(): string {    
  //   return this.tableSetting.screenMode === 'fullscreen' ? 'full-screen' : null;
  // }  

  @Input()
  @HostBinding('style.direction')
  get direction(): Direction {
    return this.tableSetting?.direction;
  }
  set direction(value: Direction) {
    this.tableSetting.direction = value;
  }

  // FullScreen Mode //    
  @HostBinding('style')
  get fullscreen(): string {
    return this.tableSetting.screenMode === 'fullscreen' ? FULLSCREEN_STYLE: null;
  }  

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
    this._rowSelectionMode = selection || 'none';
    this._rowSelectionModel = this._rowSelectionMode === 'none' ? null : new SelectionModel<T>(this._rowSelectionMode === 'multi', []);
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

  private totalRecord = 0;

  @Input() 
  get dataSource() {    
    if(isNullorUndefined(this.tvsDataSource)) {      
      return null;
    }    
    if (this.totalRecord !== this.tvsDataSource.allData.length) {
      this.addUpdateSystemField(this.tvsDataSource.allData);           
      this.tvsDataSource.data = Object.assign([], this.tvsDataSource.data);     
    }
    return this.tvsDataSource;
  } 
  set dataSource(value: TableVirtualScrollDataSource<T>) {       
    this.clear();    
    console.log(typeof value);
    
    if (!isNullorUndefined(value)) {      
      this.addUpdateSystemField(value.data);
      this.tvsDataSource = value;
      this.tvsDataSource.sort = this.sort;
      (this.tvsDataSource as any)._paginator = value;      
    }
  }

  private async addUpdateSystemField(data: T[]) {
    data = data.map( (item, index) => {
      item.id = index ;
      item.option = item.option || {};
      return item;
    });
    this.totalRecord = this.tvsDataSource.allData.length;
  }

  public expandColumn = [];
  private _expandComponent: any;
  @Input()
  get expandComponent(): any {    
    return this._expandComponent;
  }
  set expandComponent(value: any) {
    // console.log(this.expandColumn);
    this._expandComponent = value;
    if (this._expandComponent !== null && this._expandComponent !== undefined) {
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
      // default value for fields
      f.print = f.print || true;
      f.header = f.header || titleCase(f.name);
      f.display = getObjectProp('display', 'visible' , settingField, f ); // f.display ? f.display : 'visible';
      f.filter = getObjectProp('filter', 'client-side' , settingField, f ); // f.filter ? f.filter : 'client-side';
      f.sort = getObjectProp('sort', 'client-side' , settingField, f ); // f.sort ? f.sort : 'client-side';
      f.sticky = getObjectProp('sticky', 'none' , settingField, f ); // f.sticky ? f.sticky : 'none';
      f.width =  getObjectProp('width', this.defaultWidth , settingField, f ); // f.width ? f.width : this.defaultWidth;
    });
    this.tableColumns = fields;   
    this.updateColumn();     
  }

  public updateColumn() {    
    if (isNullorUndefined(this.tableSetting.columnSetting) ) {
      this.tableSetting.columnSetting = clone(this.tableColumns);
      this.refreshTableSetting();
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
  @Input() showReload: boolean;  
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onTableEvent: EventEmitter<ITableEvent> = new EventEmitter();
  @Output() onRowEvent: EventEmitter<IRowEvent> = new EventEmitter();
  @Output() settingChange: EventEmitter<any> = new EventEmitter();
  @Output() paginationChange: EventEmitter<TablePagination> = new EventEmitter();
  

  //**this event is deperact and move to onRowEvent */
  @Output() rowActionMenuChange: EventEmitter<IRowActionMenuEvent<any>> = new EventEmitter();
  
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
  // private menus: TableMenu[] = [];
  public tableColumns: TableField<T>[];
  public tvsDataSource: TableVirtualScrollDataSource<T> = new TableVirtualScrollDataSource<T>([]);;

  private _rowSelectionMode: TableSelectionMode;
  private _rowSelectionModel = new SelectionModel<T>(true, []);
  private _tablePagination: TablePagination = { };
  public tablePagingMode: TablePaginationMode  = 'none';
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
    // window.requestAnimationFrame(() => {      
      
    // });
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
    this.cdr.detectChanges();
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
      if (this._rowSelectionMode === 'multi' || this._rowSelectionMode === 'single') {
        //bugfixed becuse of double header show
        setTimeout(() => {
          this.displayedColumns = ['row-checkbox', ...this.displayedColumns];
        }, 500);
        console.log(this.displayedColumns);        
        
        console.log(this.displayedColumns);
        // requestAnimationFrame( () => {
        //   console.log(this.displayedColumns);        
        //   this.displayedColumns = ['row-checkbox', ...this.displayedColumns];
        //   console.log(this.displayedColumns);        
        // });
      }
      if (this.tableSetting.visibleTableMenu !== false) {
        this.displayedColumns.push('table-menu');
      }
    }
    this.updatePagination();
    // this.cdr.detectChanges();
  }

  requestFullscreen(element: ElementRef) {
    if (element.nativeElement.requestFullscreen) {
      element.nativeElement.requestFullscreen();
    } else if (element.nativeElement.webkitRequestFullscreen) { /* Safari */
      element.nativeElement.webkitRequestFullscreen();
    } else if (element.nativeElement.msRequestFullscreen) { /* IE11 */
      element.nativeElement.msRequestFullscreen();
    }
  }

  /************************************ Drag & Drop Column *******************************************/ 
  // public refreshGrid() {    
  //   window.requestAnimationFrame( () =>{
  //     this.table.renderRows();
  //   this.cdr.markForCheck();
  //   this.refreshTableSetting();
  //   this.cdr.detectChanges();      
  //   });
  //   this.table.renderRows();
  //   this.cdr.markForCheck();
  //   this.refreshTableSetting();
  //   this.cdr.detectChanges();
  // }  

  public refreshGrid() {
    this.table.renderRows();
    this.cdr.markForCheck();
    // if (this.dataSource && this.dataSource.allData) {
    //   this.dataSource = new TableVirtualScrollDataSource<T>(this.dataSource.allData);
    // }
  }

  public moveRow(from: number, to: number) {
    if (from >= 0 && from < this.dataSource.allData.length  && to >= 0 && to < this.dataSource.allData.length ) {      
        this.dataSource.allData[from].id = to;
        this.dataSource.allData[to].id = from;
        // console.log('move',from, to);        
        moveItemInArray(this.dataSource.allData, from, to);
        this.tvsDataSource.data = Object.assign([], this.tvsDataSource.data);
    }
  }

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
    const numSelected = this._rowSelectionModel.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this._rowSelectionModel.clear() :
      this.dataSource.data.forEach(row => this._rowSelectionModel.select(row));    
    this.onRowEvent.emit({ event: 'MasterSelectionChange', sender:  this._rowSelectionModel});
  }

  onRowSelectionChange(e: any, row: T) {
    if (e) {
      this._rowSelectionModel.toggle(row);
      this.onRowEvent.emit({ event: 'RowSelectionChange', sender:  this._rowSelectionModel});
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this._rowSelectionModel.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}

