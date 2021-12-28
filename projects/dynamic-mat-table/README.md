# Dynamic Table for Angular

![Screen Shot](https://github.com/farshadbayat/images/blob/main/Dynamic-Mat-Table-Screenshot.png?raw=true)

## Online Demo
Latest Version:

https://stackblitz.com/edit/angular-ivy-wge9lp

version (1.3.2):

https://stackblitz.com/edit/angular-ivy-s4ne42
## Getting Started

A full demo can be found on the github repository.

Install with npm:

`npm i dynamic-mat-table`

After installation include `DynamicMatTableModule` in your module imports:

```javascript
import { DynamicMatTableModule } from 'dynamic-mat-table';
...
imports: [
    DynamicMatTableModule
  ],
...
```

Column types are defined as follow:


```javascript
export interface AbstractField {
  index?: number;
  name: string;           /* The key of the data */
  type?: FieldType;       /* Type of data in the field */
  width?: number;         /* width of column */
  header?: string;        /* The title of the column */
  isKey?: boolean;
  inlineEdit?: boolean;
  display?: FieldDisplay; /* Hide and visible this column */
  sticky?: FieldSticky;   /* sticky this column to start or end */
  filter?: FieldFilter;
  sort?: FieldSort;
  cellClass?: string;     /* Apply a class to a cell, class name must be in the global stylesheet */
  cellStyle?: any;        /* Apply a style to a cell, style must be object ex: [...].cellStyle = {'color' : 'red'} */
  icon?: string;          /* Set Icon in Column */
  iconColor?: string;     /* Set Icon Color */
  dynamicCellComponent?: any; /* Set Dynamic Component in Cell */
  draggable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  clickable?: boolean;
  clickType?: 'cell' | 'label' | 'custom';
  printable?: boolean;    /* disply in printing view by defualt is true */
  exportable?: boolean;
  enableContextMenu?: boolean;
  rowSelectionable?: boolean;
  /* For Ellipsis Text */
  cellEllipsisRow?: number;
  cellTooltipEnable?: boolean;
  headerEllipsisRow?: number;
  headerTooltipEnable?: boolean;
  option?: any; // for store share data show in cell of column
  categoryData?: any[];
  toString?: (column: TableField<any>, row: TableRow) => string;
  customSort?: (column: TableField<any>, row: any) => string;
}
```


Source data must be an BehaviorSubject:

```javascript
let data = [
  { "row": 1, "name": "Element #4", "weight": "65 KG", "color": "Magenta", "brand": "Zanjan Benz", "type": "Van" }, ...];

public dataSource$: BehaviorSubject<any[]>;

/* for load data */
this.dataSource$.next(this.data);
```

Data row is extend from TableRow:
-can apply class or style to row with option field.
-can share data to all cell in the row.
-can defined expand state.

```javascript
export interface TableRow {
    id?: number;
    rowActionMenu?: {
        [key: string]: RowActionMenu;
    };
    option?: RowOption;
}

export interface RowOption extends Dictionary<any> {
    style?: any;
    class?: any;
    selected?: boolean;
    expand?: boolean;
}
```


In the HTML add the selector:

Minimum Specification (Mandatory):
```html
  <dynamic-mat-table tableName="demo_table"
                     [columns]="fields"
                     [dataSource]="dataSource">
  </dynamic-mat-table> 
```

Full Specification:
```html
<dynamic-mat-table  tableName="demo_table"
                    [scrollStrategyType]="scrollStrategyType"
                    [contextMenuItems]="contextMenuItems"
                    [showReload] = "showReloadData"
                    [direction]="direction"
                    [expandComponent]="expandComponent"
                    [rowHeight]="rowHeight"
                    [columns]="fields"
                    [pending]="pending"
                    [setting]="setting"
                    [sticky]="stickyHeader"
                    [dataSource]="dataSource$"
                    [pagingMode]="paginationMode"
                    [pagination]="pagination"
                    [showNoData]="showNoData"
                    [printConfig]="printConfig"
                    [rowSelectionMode]="rowSelectionMode"
                    [rowSelectionModel]="selectionModel"
                    [showProgress]="showProgress"
                    [rowContextMenuItems]="contextMenuItems"
                    (onTableEvent)="tableEvent_onClick($event)"
                    (onRowEvent)="rowEvent_onClick($event)"
                    [class.conditional-class]="conditinalClass"
                    (settingChange)="table_onChangeSetting($event)"
                    (rowSelectionChange)="table_onRowSelectionChange($event)">
</dynamic-mat-table>
```

Inputs:

```html
  `columns` = Column definitions
  `dataSource` = Table data in BehaviorSubject
  `sticky` = Enable the sticky on header
  `showNoData` = show custom text on center if there is not any record
  `showProgress` = active progress on table
  `pending` = pending progress on table
  `selection` = active selection row ('single' | 'multi' | 'none')
  `pagination` = configuration for pagination. eg: { pageIndex: 0, pageSize: 10, pageSizeOptions: [ 5, 10, 100, 1000], showFirstLastButtons: true }
  `pagingMode` = paging mode ('none' | 'client' | 'server')

  `class.conditional-class` = apply custom style. eg:
  
    /* Conditional Class & Overwrite Style */
    :host ::ng-deep .conditional-class .mat-table .row-selection{
      background-color:rgb(7, 140, 163) !important; /* for over write */
      border-radius: 5px;
      .mat-cell {
        color: white !important;
      }
    }

    /* Style Element Inside Table */
    :host ::ng-deep dynamic-mat-table .mat-table mat-row{
      cursor: pointer;
    }  

  `setting` = can restore column setting(width, order, visible, ...) with this parameter.
  `dir` = rtl/ltr.
  `printConfig` = print configuration. eg: { title: 'Print All Test Data' , showParameters: true }
  `actionMenu` = show action menu on each row and can change menu parameters: suppose  
    this.actionMenu.push(
      { name: 'Edit', text: 'Edit', color: 'primary', icon: 'edit', disabled: false, visible: true},
      { name: 'Delete',text: 'Delete Record', color: 'warn', icon: 'delete', disabled: false, visible: true});
    Customize for one record:
    this.dataSource.allData[0].actionMenu = { Edit: { text: 'View', color: 'primary', icon: 'build_circle'}, Delete: {visible: false}};  
  `settingChange` = Output all configuration of columns
  `rowActionMenuChange` = Output for action menu that clicked
  `rowClick` = Output for the click event on the row
```

Table Setting
```javascript
export interface TableSetting {  
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
  scrollStrategy?: TableScrollStrategy;
  rowStyle?: any;
  enableContextMenu?: boolean;
  autoHeight?: boolean;
  saveSettingMode?: 'simple' | 'multi' | 'none';
  settingName?: string;
  settingList?: TableSetting[];
  currentSetting?: string;
}
```

For more examples run the demo application.

## How to add international
to support new language you must declare new class and implement LanguagePack for example this is persian language:
```javascript
import { MatPaginatorIntl } from '@angular/material/paginator';
import { FilterLabels, LanguagePack, MenuLabels, TableLabels } from 'dynamic-mat-table';
export class PersionLanguage implements LanguagePack {

  constructor() {
  }

  menuLabels: MenuLabels = {
    saveData: 'ذخیره داده ها ',
    columnSetting: 'تنظیمات ستون ها ',
    saveTableSetting: 'ذخیره  تنظیمات جدول',
    clearFilter: 'فیلتر را پاک کنید',
    jsonFile: 'Json فایل',
    csvFile: 'CSV فایل',
    printTable: 'چاپ جدول',
    filterMode: 'نوع فیلتر',
    filterLocalMode: 'محلی',
    filterServerMode: 'سرور',
    sortMode: 'حالت مرتب سازی',
    sortLocalMode: 'سمت کاربر',
    sortServerMode: 'سمت سرور',
    printMode: 'حالت چاپ',
    printYesMode: 'بله',
    printNoMode: 'خیر',
    pinMode: 'حالت پین ',
    pinNoneMode: 'هیچ کدام',
    pinStartMode: 'شروع',
    pinEndMode: 'پایان',
  };

  paginatorLabels: MatPaginatorIntl = {
    changes: null,
    itemsPerPageLabel: 'ایتم های هر صفحه:',
    nextPageLabel: 'صفحه بعدی:',
    previousPageLabel: 'صفحه قبلی:',
    firstPageLabel: 'اولین صفحه:',
    lastPageLabel: 'آخرین صفحه:',
    getRangeLabel : (page: number, pageSize: number, length: number) => {      
      if (length === 0 || pageSize === 0) { return `0 از ${length}`; }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} از ${length}`;
    }
  };

  tableLabels: TableLabels =
  {
    NoData: 'هیچ رکوردی پیدا نشد'
  };

  filterLabels: FilterLabels = {
    Clear: 'پاک کردن',
    Search: 'جستجو',
    And: 'و',
    Or: 'یا',
    /* Text Compare */
    Text: 'متن',
    TextContains: 'دربرگرفتن',
    TextEmpty: 'خالی بودن',
    TextStartsWith: 'شروع شدن با',
    TextEndsWith: ' پایان گرفتن با',
    TextEquals: 'مساوی بودن',
    TextNotEmpty: 'خالی نبودن',
    /* Number Compare */
    Number: 'تعداد',
    NumberEquals: 'مساوی',
    NumberNotEquals: 'مساوی نبودن',
    NumberGreaterThan: ' بزرگ تر از',
    NumberLessThan: 'کم تر از ',
    NumberEmpty: 'خالی بودن',
    NumberNotEmpty: 'خالی نبودن',
    /* Category List Compare */
    CategoryContains: 'در برگرفتن',
    CategoryNotContains: 'در بر نگرفتن',
    /* Boolean Compare */
    /* Date Compare */
  };
}
```

and passed this class to grid so :

```javascript
 providers: [
    { provide: TableIntl, useFactory: languageIntl}
  ]
```
And
```javascript
export function languageIntl() {
  return new PersionLanguage();
}
```
