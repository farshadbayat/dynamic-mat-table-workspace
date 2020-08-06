import { Component, ViewChild } from '@angular/core';
import { TableField, TableRow, PrintConfig,
  TableVirtualScrollDataSource, TableSelectionMode, DynamicMatTableComponent, TablePagination } from 'dynamic-mat-table';
// import { TableField, TableRow, TableVirtualScrollDataSource, TableSelectionMode, DynamicMatTableComponent, TablePagination } from 'dynamic-mat-table';
const DATA = getData(1000);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dynamic-mat-table';
  // required
  fields: TableField<any>[] = [];
  dataSource = new TableVirtualScrollDataSource([]);
  // optinaol
  stickyHeader = true;
  showNoData = true;
  showProgress = true;
  pending = false;
  tableSelection: TableSelectionMode = 'none';
  conditinalClass = false;
  pagination: TablePagination = { pageIndex: 0, pageSize: 10 };
  enablingPagination = false;
  direction: 'rtl' | 'ltr' = 'ltr';
  printConfig: PrintConfig = { title: 'Print All Test Data' , showParameters: true };
  @ViewChild(DynamicMatTableComponent, {static: true}) table: DynamicMatTableComponent<TestElement>;

  constructor() {
    this.fields = [
      {name: 'row', type: 'number'},
      {name: 'name', header: 'Element Name' , sticky: 'start'},
      {name: 'weight'},
      {name: 'color'},
      {name: 'brand'}
    ];
  }

  fetchData_onClick() {
    this.dataSource = new TableVirtualScrollDataSource(DATA);
  }

  table_onChangeSetting(setting) {
    console.log(setting);
  }

  columnSticky_onClick(columnSticky, type) {
    console.log(this.fields);

    if ( this.fields[columnSticky].sticky === type ) {
      this.fields[columnSticky].sticky = 'none';
    } else {
      this.fields[columnSticky].sticky = type;
    }
    console.log(this.fields);
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

  addNewColumn_onClick() {
    this.fields.push({
      name: 'type', header: 'Car Type'
    });
    const cloned = this.fields.map(x => Object.assign({}, x));
    this.fields = cloned;
  }

  addNewLongColumn_onClick() {
    this.fields.push({
      name: 'longText', header: 'Long Text'
    });
    const cloned = this.fields.map(x => Object.assign({}, x));
    this.fields = cloned;
  }

  paginationMode_onClick() {
    if ( this.enablingPagination === true) {
      this.enablingPagination = false;
    } else {
      this.enablingPagination = true;
    }
  }

  direction_onClick() {
    if (this.direction === 'ltr') {
      this.direction = 'rtl';
    } else {
      this.direction = 'ltr';
    }
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
    color: (['Red', 'Green', 'Blue', 'Yellow', 'Magenta'])[Math.floor(Math.random() * 5)],
    brand: (['Irankhodro', 'SAIPA', 'Kerman Khodro', 'Zanjan Benz', 'Tehran PIKEY'])[Math.floor(Math.random() * 5)],
    type: (['SUV', 'Truck', 'Sedan', 'Van', 'Coupe' , 'Sports Car'])[Math.floor(Math.random() * 6)],
    longText: (['Overdub: Correct your voice recordings by simply typing. Powered by Lyrebird AI.',
     'Multitrack recording — Descript dynamically generates a single combined transcript.',
     'Our style of podcasting and editing wouldn’t be possible without Descript.',
     'Live Collaboration: Real time multiuser editing and commenting.',
     'Use the Timeline Editor for fine-tuning with fades and volume editing.',
     'Edit audio by editing text. Drag and drop to add music and sound effects.'])[Math.floor(Math.random() * 6)],
  }));
}
