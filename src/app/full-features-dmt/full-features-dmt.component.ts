import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  TableRow,
  TableField,
  PrintConfig,
  TableSetting,
  TablePagination,
  TableSelectionMode,
  DynamicMatTableComponent,
  TableVirtualScrollDataSource,
  IRowEvent,
  ITableEvent
} from 'dynamic-mat-table';
import { FooterCell } from 'dynamic-mat-table/lib/models/table-footer.model';
import { TableScrollStrategy } from 'projects/dynamic-mat-table/src/lib/cores/fixed-size-table-virtual-scroll-strategy';
import { ContextMenuItem } from 'projects/dynamic-mat-table/src/public-api';
import { BehaviorSubject } from 'rxjs';
import { DynamicCellComponent } from '../dynamic-cell/dynamic-cell.component';
import { DynamicExpandCellComponent } from '../dynamic-expand-cell/dynamic-expand-cell.component';
import { FormlyCellComponent } from '../formly-cell/formly-cell.component';

const DATA = getData(5);
@Component({
  selector: 'app-full-features-dmt',
  templateUrl: './full-features-dmt.component.html',
  styleUrls: ['./full-features-dmt.component.scss']
})
export class FullFeaturesDmtComponent implements OnInit {
  eventLog = [];
  title = 'dynamic-mat-table';
  private data: any[] = [];
  public dataSource$: BehaviorSubject<any[]>;
  @ViewChild(DynamicMatTableComponent, { static: true }) table !: DynamicMatTableComponent<TestElement>;
  altRowStyle: any = {'background-color': 'red'};
  fields: TableField<any>[] = []; /* REQUIRED */
  fields$: BehaviorSubject<TableField<any>[]> = new BehaviorSubject<TableField<any>[]>([]);
  setting: TableSetting = {
    saveSettingMode: 'multi',
  };

  scrollStrategyType: TableScrollStrategy = 'fixed-size';
  showReloadData = true;
  pending = false;
  showNoData = true;
  stickyHeader = true;
  showProgress = true;
  visibleMenu = true;
  conditinalClass = false;
  paginationMode: string = 'none';
  direction: 'rtl' | 'ltr' = 'rtl';
  contextMenuItems: ContextMenuItem[] = [];
  rowSelectionMode: TableSelectionMode = 'multi';
  selectionModel: SelectionModel<TestElement> = null;
  // dataSource = new TableVirtualScrollDataSource([]); /* REQUIRED */
  rowHeight = 48;
  expandComponent = DynamicExpandCellComponent;

  pagination: TablePagination = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [ 5, 10, 100, 1000, 10000]
  };
  printConfig: PrintConfig = {
    title: 'Print All Test Data',
    showParameters: true,
  };

  constructor() {
    this.contextMenuItems.push(
      {
        name: 'Edit',
        text: 'ویرایش',
        color: 'primary',
        icon: 'edit',
        disabled: false,
        visible: true,
      },
      {
        name: 'Delete',
        text: 'حذف',
        color: 'warn',
        icon: 'delete',
        disabled: false,
        visible: true,
      }
    );
    //this.fetchData_onClick();
  }
  ngOnInit(): void {
    this.dataSource$ = new BehaviorSubject<any[]>(this.data);

    this.initField();
    this.fetchData_onClick();
    this.loadSetting();
  }

  loadSetting() {
    this.setting = {
      "alternativeRowStyle": {
          "background-color": "#d2d2d2"
      },
      "rowStyle": {
          "border-bottom": "solid 1px red;"
      },
      "saveSettingMode": "multi",
      "columnSetting": [
          {
              "name": "row",
              "width": 300,
              "cellStyle": {
                  "background-color": "#3f51b5",
                  "color": "#ffffff"
              },
              "display": "prevent-hidden",
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "header": "Row",
              "filter": "client-side",
              "sort": "client-side",
              "sticky": "none",
              "index": 0
          },
          {
              "name": "FormlyColumn",
              "header": "Formly Column",
              "option": null,
              "draggable": false,
              "filterable": false,
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "display": "hiden",
              "filter": "client-side",
              "sort": "client-side",
              "sticky": "none",
              "width": null,
              "index": 1
          },
          {
              "name": "order",
              "header": "Row Order",
              "sticky": "start",
              "option": 1,
              "clickable": false,
              "rowSelectionable": false,
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "display": "hiden",
              "filter": "client-side",
              "sort": "client-side",
              "width": null,
              "index": 2
          },
          {
              "name": "name",
              "header": "Element Name",
              "sticky": "start",
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "display": "hiden",
              "filter": "client-side",
              "sort": "client-side",
              "width": null,
              "index": 3
          },
          {
              "name": "weight",
              "sort": "server-side",
              "clickType": "label",
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "header": "Weight",
              "display": "hiden",
              "filter": "client-side",
              "sticky": "none",
              "width": null,
              "index": 4
          },
          {
              "name": "color",
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "header": "Color",
              "display": "hiden",
              "filter": "client-side",
              "sort": "client-side",
              "sticky": "none",
              "width": null,
              "index": 5
          },
          {
              "name": "brand",
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "header": "Brand",
              "display": "hiden",
              "filter": "client-side",
              "sort": "client-side",
              "sticky": "none",
              "width": null,
              "index": 6
          },
          {
              "name": "setting",
              "icon": "chrome_reader_mode",
              "iconColor": "blue",
              "option": 2,
              "clickable": false,
              "rowSelectionable": false,
              "printable": true,
              "exportable": true,
              "enableContextMenu": true,
              "header": "Setting",
              "display": "visible",
              "filter": "client-side",
              "sort": "client-side",
              "sticky": "none",
              "width": null,
              "index": 7
          }
      ],
      "direction": "rtl",
      "visibaleActionMenu": null,
      "settingName": "T2",
      "settingList": [
          {
              "alternativeRowStyle": {
                  "background-color": "#d2d2d2"
              },
              "rowStyle": {
                  "border-bottom": "solid 1px red;"
              },
              "saveSettingMode": "multi",
              "columnSetting": [
                  {
                      "name": "row",
                      "width": 300,
                      "cellStyle": {
                          "background-color": "#3f51b5",
                          "color": "#ffffff"
                      },
                      "display": "prevent-hidden",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Row",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none"
                  },
                  {
                      "name": "FormlyColumn",
                      "header": "Formly Column",
                      "option": null,
                      "draggable": false,
                      "filterable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null
                  },
                  {
                      "name": "order",
                      "header": "Row Order",
                      "sticky": "start",
                      "option": 1,
                      "clickable": false,
                      "rowSelectionable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "width": null
                  },
                  {
                      "name": "name",
                      "header": "Element Name",
                      "sticky": "start",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "width": null
                  },
                  {
                      "name": "weight",
                      "sort": "server-side",
                      "clickType": "label",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Weight",
                      "display": "visible",
                      "filter": "client-side",
                      "sticky": "none",
                      "width": null
                  },
                  {
                      "name": "color",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Color",
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null
                  },
                  {
                      "name": "brand",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Brand",
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null
                  },
                  {
                      "name": "setting",
                      "icon": "chrome_reader_mode",
                      "iconColor": "blue",
                      "option": 2,
                      "clickable": false,
                      "rowSelectionable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Setting",
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null
                  }
              ],
              "direction": "rtl",
              "visibaleActionMenu": null,
              "settingName": "T1"
          },
          {
              "alternativeRowStyle": {
                  "background-color": "#d2d2d2"
              },
              "rowStyle": {
                  "border-bottom": "solid 1px red;"
              },
              "saveSettingMode": "multi",
              "columnSetting": [
                  {
                      "name": "row",
                      "width": 300,
                      "cellStyle": {
                          "background-color": "#3f51b5",
                          "color": "#ffffff"
                      },
                      "display": "prevent-hidden",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Row",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "index": 0
                  },
                  {
                      "name": "FormlyColumn",
                      "header": "Formly Column",
                      "option": null,
                      "draggable": false,
                      "filterable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "hiden",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null,
                      "index": 1
                  },
                  {
                      "name": "order",
                      "header": "Row Order",
                      "sticky": "start",
                      "option": 1,
                      "clickable": false,
                      "rowSelectionable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "hiden",
                      "filter": "client-side",
                      "sort": "client-side",
                      "width": null,
                      "index": 2
                  },
                  {
                      "name": "name",
                      "header": "Element Name",
                      "sticky": "start",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "display": "hiden",
                      "filter": "client-side",
                      "sort": "client-side",
                      "width": null,
                      "index": 3
                  },
                  {
                      "name": "weight",
                      "sort": "server-side",
                      "clickType": "label",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Weight",
                      "display": "hiden",
                      "filter": "client-side",
                      "sticky": "none",
                      "width": null,
                      "index": 4
                  },
                  {
                      "name": "color",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Color",
                      "display": "hiden",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null,
                      "index": 5
                  },
                  {
                      "name": "brand",
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Brand",
                      "display": "hiden",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null,
                      "index": 6
                  },
                  {
                      "name": "setting",
                      "icon": "chrome_reader_mode",
                      "iconColor": "blue",
                      "option": 2,
                      "clickable": false,
                      "rowSelectionable": false,
                      "printable": true,
                      "exportable": true,
                      "enableContextMenu": true,
                      "header": "Setting",
                      "display": "visible",
                      "filter": "client-side",
                      "sort": "client-side",
                      "sticky": "none",
                      "width": null,
                      "index": 7
                  }
              ],
              "direction": "rtl",
              "visibaleActionMenu": null,
              "settingName": "T2"
          }
      ],
      "currentSetting": "T2"
    };
    setTimeout(() => {
      this.table.refreshUI();
    }, 100);
  }

  footerContent: FooterCell = {
    aggregateText: 'New Footer Cell Content'
  }
  initField() {

    this.fields = [
      {
         name: 'row',
        // type: 'number',
         width: 300,
         cellStyle: {'background-color': '#3f51b5', 'color':'#ffffff'},
         display: 'prevent-hidden',
         classNames: 'custom-header',
        //  footer: [{
        //   aggregateText: 'Test1'
        // }]
     },
     {
      name: 'FormlyColumn',
      header: 'Formly Column',
      option: null,
      dynamicCellComponent: FormlyCellComponent,
      draggable: false,
      filterable: false,
      footer: [
        this.footerContent,
        {
          aggregateText: 'Test22',
          footerStyle: [{ 'color': 'red'}]
        }
    ]
      },
     {
       name: 'order',
       header: 'Row Order',
       sticky: 'start',
       option: 1,
       dynamicCellComponent: DynamicCellComponent,
       clickable: false,
       rowSelectionable: false,
       footer: [{
        aggregateText: 'Test3',
       }],
       toExport: (v, type)=>{
          console.log(v);
        }
       },
      {
        name: 'name',
        header: 'Element Name',
        footer: [{
          aggregateText: 'Test4',
         }],
        sticky: 'start' },
      {
        name: 'weight',
        sort: 'server-side',
        footer: [{
          aggregateText: 'Test5',
         }],
        clickType: 'label'
       },
      {
        name: 'color',
        footer: [{
          aggregateText: 'Test6',
         }],
      },
      {
        name: 'brand',
        footer: [{
          aggregateText: 'Test7',
         }],
      },
      {
        name: 'setting',
        icon: 'chrome_reader_mode',
        iconColor: 'blue',
        dynamicCellComponent: DynamicCellComponent,
        option: 2,
        clickable: false,
        rowSelectionable: false,
        footer: [{
          aggregateText: 'Test8',
         }],
        toExport: (d, t) => {
          return 1;
        }
        // filterable: false,
        // draggable: false,
        // sortable: false,
      }
    ];

    this.fields$.next([...this.fields]);
    setInterval(() =>{
      this.fields$.next([...this.fields]);
      console.log('ss');

    }, 5000);
  }

  fetchData_onClick() {
    this.data = DATA.map( item =>{return {...item, option:{ expandCallback: null, style: null}}});
    this.data[1].option.style = { 'background-color' : 'red' };
    this.dataSource$.next(this.data);
  }

  table_onChangeSetting(setting) {
    console.log(setting);
    localStorage.setItem('tableConfig',JSON.stringify(setting));
    // if(setting && setting?.settingName !== '') {
    //   this.setting.settingList.push(setting?.settingName);
    // }
  }

  tableonRowActionChange(e) {
    this.eventLog.push(e);
  }

  columnSticky_onClick(columnSticky, type) {
    // console.log(this.fields);

    if (this.fields[columnSticky].sticky === type) {
      this.fields[columnSticky].sticky = 'none';
    } else {
      this.fields[columnSticky].sticky = type;
    }
    // console.log(this.fields);
  }

  tableSelection_onClick() {
    if (this.rowSelectionMode === 'multi') {
      this.rowSelectionMode = 'single';
    } else if (this.rowSelectionMode === 'single') {
      this.rowSelectionMode = 'none';
    } else {
      this.rowSelectionMode = 'multi';
    }
  }

  selectToggle_onClick() {
    // const selection: SelectionModel<TestElement> = new SelectionModel(true);
    // for(let i=0 ; i< 10 ; i++) {
    //   selection.select(this.dataSource$.value[i]);
    // }
    // this.selectionModel = selection;
  }

  tableVST_onClick() {
    this.scrollStrategyType
  }

  table_onRowSelectionChange(e) {
    // console.log(e);
  }

  addNewColumn_onClick() {
    this.fields.push({
      name: 'type',
      header: 'Car Type',
    });
    const cloned = this.fields.map((x) => Object.assign({}, x));
    this.fields = cloned;
  }

  addNewLongColumn_onClick() {
    this.fields.push({
      name: 'longText',
      header: 'Long Text Header',
      cellTooltipEnable: true,
      cellEllipsisRow: 3,
      headerEllipsisRow: 1,
      headerTooltipEnable: true
    });
    const cloned = this.fields.map((x) => Object.assign({}, x));
    this.fields = cloned;
  }

  paginationMode_onClick() {
    if (this.paginationMode === 'client') {
      this.paginationMode = 'server';
    } else if (this.paginationMode === 'server') {
      this.paginationMode = 'none';
    } else if (this.paginationMode === 'none') {
      this.paginationMode = 'client';
    }
    //this.fetchData_onClick();
  }

  direction_onClick() {
    this.direction === 'ltr'
      ? (this.direction = 'rtl')
      : (this.direction = 'ltr');
  }

  expandIndex = 0;
  expandToggle_onClick() {
    this.table.expandRow( this.expandIndex);
    this.expandIndex++;
  }

  tableEvent_onClick(e: ITableEvent) {
    console.log(e);
    if (e.event === 'ReloadData') {
      this.fetchData_onClick();
    } else if( e.event === 'SortChanged') {
      console.log(e.sender);

    }
  }

  rowEvent_onClick(e: IRowEvent) {
    // console.log(this.table.dataSource.allData);
    console.log(e);
    // console.log(e.event);
    if (e.event === 'RowSelectionChange') {
      // console.log('Row Selection Change',e.sender);
    } else if(e.event === 'RowClick' &&  e.sender.row) {
      // change style
      if(!e.sender.row.option){
        e.sender.row.option = {};
      }
      // if option not defined
      if (e.sender.column && !e.sender.row.option[e.sender.column.name]) {
        e.sender.row.option[e.sender.column.name] = {};
      }
    } else if(e.event === 'CellClick' && e.sender.column) {
      if (e.sender.row.option[e.sender.column.name] === undefined) {
        e.sender.row.option[e.sender.column.name] = {};
      }
      e.sender.row.option[e.sender.column.name].style = {'background-color': '#ff4081', 'color':'white'};
    } else if(e.event.type === 'dblclick' &&  e.sender.row) {
      // change style
      if(!e.sender.row.option){
        e.sender.row.option = {};
      }
      // if option not defined
      e.sender.row.option.style = {'background-color': '#ff4081', 'color':'white'};
    }
  }

  visible_onChange(e) {
    const setting = Object.assign({}, this.setting);
    setting.visibleTableMenu = e.checked;
    this.setting= setting;
    // console.log(e.checked);
  }

  addNew_onClick() {
    //console.log(this.dataSource.allData);
    // this.dataSource$.value.push({row: 12, name: 'ww', weight: 12, color: 'red', brand: 'zanjna'});
    // this.dataSource.refreshFilterPredicate();
    //this.dataSource =  new TableVirtualScrollDataSource(this.dataSource.allData);
    //this.table.refreshTableSetting();
  }

  changeCell_onClick() {
    // this.dataSource$.value[0].name = new Date().toString();
  }

  clearSelection_onClick() {
    this.table.rowSelectionModel.clear();
  }

  refresh_onClick() {
    this.loadSetting();
    this.table.refreshUI();
  }

  loadSetting_onClick() {
    if(localStorage.getItem('tableConfig')) {
      this.setting = JSON.parse(localStorage.getItem('tableConfig'));
    }
  }

  changeFooter_onClick() {
    this.footerContent.aggregateText = '121212';
    this.table.refreshUI();
  }

  autoHeight_onClick() {
    this.setting.autoHeight = ! this.setting?.autoHeight;
    this.dataSource$.next(this.dataSource$.value);
  }

  clearField_onClick() {
    this.fields$.next([...this.fields]);
    this.table.refreshUI();
  }
}

export interface TestElement extends TableRow {
  row: number;
  name: string;
  weight: string;
  color: string;
  brand: string;
}

export function getData(n = 1000): TestElement[] {
  return Array.from({ length: n }, (v, i) => ({
    row: i + 1,
    FormlyColumn: 'allah',
    name: `Element #${i + 1}`,
    weight: Math.floor(Math.random() * 100) + ' KG',
    color: ['Red', 'Green', 'Blue', 'Yellow', 'Magenta'][
      Math.floor(Math.random() * 5)
    ],
    brand: [
      'ایران خودرو',
      'سایپا',
      'کرمان خودرو',
      'Zanjan Benz',
      'Tehran PIKEY',
    ][Math.floor(Math.random() * 5)],
    type: ['SUV', 'Truck', 'Sedan', 'Van', 'Coupe', 'Sports Car'][
      Math.floor(Math.random() * 6)
    ],
    longText: [
      'Overdub: Correct your voice recordings by simply typing. Powered by Lyrebird AI.',
      'Multitrack recording — Descript dynamically generates a single combined transcript.',
      'Our style of podcasting and editing wouldn’t be possible without Descript.',
      'Live Collaboration: Real time multiuser editing and commenting.',
      'Use the Timeline Editor for fine-tuning with fades and volume editing.',
      'Edit audio by editing text. Drag and drop to add music and sound effects.',
    ][Math.floor(Math.random() * 6)],
  }));
}
