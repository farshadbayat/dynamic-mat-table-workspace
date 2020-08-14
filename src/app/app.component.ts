import { Component, ViewChild } from "@angular/core";
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
} from "dynamic-mat-table";

const DATA = getData(1000);
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  eventLog = [];
  title = "dynamic-mat-table";
  @ViewChild(DynamicMatTableComponent, { static: true })
  table: DynamicMatTableComponent<TestElement>;

  fields: TableField<any>[] = []; /* REQUIRED */
  setting: TableSetting;
  pending = false;
  showNoData = true;
  stickyHeader = true;
  showProgress = true;
  conditinalClass = false;
  paginationMode: string = 'server';
  direction: "rtl" | "ltr" = "ltr";
  rowActionMenu: RowActionMenu[] = [];
  tableSelection: TableSelectionMode = "none";
  dataSource = new TableVirtualScrollDataSource([]); /* REQUIRED */

  pagination: TablePagination = {
    pageIndex: 0,
    pageSize: 10,
  };
  printConfig: PrintConfig = {
    title: "Print All Test Data",
    showParameters: true,
  };

  constructor() {
    this.fields = [
      { name: "row", type: "number" },
      { name: "name", header: "Element Name", sticky: "start" },
      { name: "weight" },
      { name: "color" },
      { name: "brand" },
    ];

    this.actionMenu.push(
      {
        name: "Edit",
        text: "ویرایش",
        color: "primary",
        icon: "edit",
        disabled: false,
        visible: true,
      },
      {
        name: "Delete",
        text: "حذف",
        color: "warn",
        icon: "delete",
        disabled: false,
        visible: true
      },
      {
        name: 'View',
        text: 'مشاهده',
        color: 'accent',
        icon: 'all_inbox',
        disabled: false,
        visible: true
      }
    );
  }

  fetchData_onClick() {

    this.dataSource = new TableVirtualScrollDataSource(DATA);
    this.dataSource.allData[0].actionMenu = {
      View: { text: 'View', color: 'primary', icon: 'build_circle'},
      Delete: {visible: false}
    };
  }

  table_onChangeSetting(setting) {
    console.log(setting);
  }

  table_onRowActionChange(e) {
    this.eventLog.push(e);
  }

  table_onRowClick(e) {
    this.eventLog.push(e);
  }

  columnSticky_onClick(columnSticky, type) {
    console.log(this.fields);

    if (this.fields[columnSticky].sticky === type) {
      this.fields[columnSticky].sticky = "none";
    } else {
      this.fields[columnSticky].sticky = type;
    }
    console.log(this.fields);
  }

  tableSelection_onClick() {
    if (this.tableSelection === "multi") {
      this.tableSelection = "single";
    } else if (this.tableSelection === "single") {
      this.tableSelection = "none";
    } else {
      this.tableSelection = "multi";
    }
  }

  table_onRowSelectionChange(e) {
    console.log(e);
  }

  addNewColumn_onClick() {
    this.fields.push({
      name: "type",
      header: "Car Type",
    });
    const cloned = this.fields.map((x) => Object.assign({}, x));
    this.fields = cloned;
  }

  addNewLongColumn_onClick() {
    this.fields.push({
      name: "longText",
      header: "Long Text",
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
    this.direction === "ltr"
      ? (this.direction = "rtl")
      : (this.direction = "ltr");
  }
  
  row_onClick($event) {
    console.log(`row ${$event.row} clicked!`);
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
    weight: Math.floor(Math.random() * 100) + " KG",
    color: ["Red", "Green", "Blue", "Yellow", "Magenta"][
      Math.floor(Math.random() * 5)
    ],
    brand: [
      "Irankhodro",
      "SAIPA",
      "Kerman Khodro",
      "Zanjan Benz",
      "Tehran PIKEY",
    ][Math.floor(Math.random() * 5)],
    type: ["SUV", "Truck", "Sedan", "Van", "Coupe", "Sports Car"][
      Math.floor(Math.random() * 6)
    ],
    longText: [
      "Overdub: Correct your voice recordings by simply typing. Powered by Lyrebird AI.",
      "Multitrack recording — Descript dynamically generates a single combined transcript.",
      "Our style of podcasting and editing wouldn’t be possible without Descript.",
      "Live Collaboration: Real time multiuser editing and commenting.",
      "Use the Timeline Editor for fine-tuning with fades and volume editing.",
      "Edit audio by editing text. Drag and drop to add music and sound effects.",
    ][Math.floor(Math.random() * 6)],
  }));
}
