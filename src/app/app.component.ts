import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import {
  TableRow,
  TableField,
  PrintConfig,
  TableSetting,
  RowActionMenu,
  TablePagination,
  TableSelectionMode,
  DynamicMatTableComponent,
  TableVirtualScrollDataSource,
  IEvent
} from 'dynamic-mat-table';
import { DynamicCellComponent } from './dynamic-cell/dynamic-cell.component';
import { DynamicExpandCellComponent } from './dynamic-expand-cell/dynamic-expand-cell.component';

const DATA = getData(500);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  eventLog = [];
  title = 'dynamic-mat-table';
  @ViewChild(DynamicMatTableComponent, { static: true }) table !: DynamicMatTableComponent<TestElement>;
  altRowStyle: any = {'background-color': 'red'};
  fields: TableField<any>[] = []; /* REQUIRED */
  setting: TableSetting= {
    alternativeRowStyle: {'background-color': '#d2d2d2'}
  }; 
  pending = false; 
  showNoData = true;
  stickyHeader = true;
  showProgress = true;
  visibleMenu = true;
  conditinalClass = false;
  paginationMode: string = 'server';
  direction: 'rtl' | 'ltr' = 'ltr';
  rowActionMenu: RowActionMenu[] = [];
  tableSelection: TableSelectionMode = 'none';
  dataSource = new TableVirtualScrollDataSource([]); /* REQUIRED */
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

  selection: SelectionModel<TestElement> = null;

  constructor() {
    this.fields = [
      {
         name: 'row',
         type: 'number',
         cellStyle: {'background-color': '#3f51b5', 'color':'#ffffff'}
     },
     { 
       name: 'order',
       header: 'Row Order',
       sticky: 'start',
       option: 1,
       dynamicCellComponent: DynamicCellComponent,
       clickable: false,
       rowSelectionable: false,
       },
      { name: 'name', header: 'Element Name', sticky: 'start' },
      { name: 'weight' },
      { name: 'color' },
      { name: 'brand' },      
      {
        name: 'setting',
        icon: 'chrome_reader_mode',
        iconColor: 'blue',
        dynamicCellComponent: DynamicCellComponent,
        option: 2,
        clickable: false,
        rowSelectionable: false,
        // filterable: false,
        // draggable: false,
        // sortable: false,
      }
    ];

    this.rowActionMenu.push(
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
  }

  fetchData_onClick() {
    this.dataSource = new TableVirtualScrollDataSource(DATA);
  }

  table_onChangeSetting(setting) {
    // console.log(setting);
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
    if (this.tableSelection === 'multi') {
      this.tableSelection = 'single';
    } else if (this.tableSelection === 'single') {
      this.tableSelection = 'none';
    } else {
      this.tableSelection = 'multi';
    }
  }

  selectToggle_onClick() {
    const selection: SelectionModel<TestElement> = new SelectionModel(true);    
    for(let i=0 ; i< 10 ; i++) {
      selection.select(this.dataSource.allData[i]);
    }    
    this.selection = selection;
    // console.log(this.selection);
    
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
      header: 'Long Text',
    });
    const cloned = this.fields.map((x) => Object.assign({}, x));
    this.fields = cloned;
  } 

  paginationMode_onClick() {
    this.paginationMode == 'client'
      ? (this.paginationMode = 'server')
      : (this.paginationMode = 'client');
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
  
  row_onClick(e: IEvent) {
    // console.log(this.table.dataSource.allData);
    
    // console.log(e.event);
    if (e.event === 'RowSelectionChange') {
      // console.log('Row Selection Change',e.sender);      
    } else if(e.event.type === 'click' &&  e.sender.row) {
      // change style
      if(!e.sender.row.option){
        e.sender.row.option = {};
      }
      // if option not defined
      if (!e.sender.row.option[e.sender.column.name]) {        
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
    name: `Element #${i + 1}`,
    weight: Math.floor(Math.random() * 100) + ' KG',
    color: ['Red', 'Green', 'Blue', 'Yellow', 'Magenta'][
      Math.floor(Math.random() * 5)
    ],
    brand: [
      'Irankhodro',
      'SAIPA',
      'Kerman Khodro',
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
