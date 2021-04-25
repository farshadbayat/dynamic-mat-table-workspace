import { TableRow } from './table-row.model';

export declare type AtRenderFunc<R extends TableRow> = (row: R) => string;
export declare type AtClassFunc = (row: any, col: any) => string;
export declare type AtSortFunc<R extends TableRow> = (data: R[], col: any) => string;
export declare type AtFilterFunc<R extends TableRow> = (data: R[], col: any) => string;
export declare type ToPrint = (data: any) => any;
export declare type ToExport = (data: any, type: any) => any;
export declare type FieldType = 'text' | 'number' | 'date' | 'category';
export declare type FieldDisplay = 'visible' | 'hiden' | 'prevent-hidden';
export declare type FieldSticky = 'start' | 'end' | 'none';
export declare type FieldFilter = 'client-side' | 'server-side' | 'none';
export declare type FieldSort = 'client-side' | 'server-side' | 'none';

export interface TableField<R extends TableRow> extends AbstractField {
    // renderer?: AtRenderFunc<R>;
    classNames?: string;
    rowClass?: string | AtClassFunc;
    customSortFunction?: AtSortFunc<R>;
    customFilterFunction?: AtSortFunc<R>;    
    toPrint?: ToPrint;
    toExport?: ToExport;
}

export interface AbstractField {
  index?: number;
  name: string;
  type?: FieldType;
  width?: number;
  header?: string;
  isKey?: boolean;
  inlineEdit?: boolean;
  display?: FieldDisplay;
  sticky?: FieldSticky;
  filter?: FieldFilter;
  sort?: FieldSort;
  cellClass?: string;
  cellStyle?: any;
  icon?: string;
  iconColor?: string;  
  dynamicCellComponent?: any;
  draggable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  clickable?: boolean;  
  printable?: boolean;
  exportable?: boolean;
  enableContextMenu?: boolean;
  rowSelectionable?: boolean;
  option?: any; // for store share data show in cell of column
  categoryData?: any[];
  toString?: (column: TableField<any>, row: TableRow) => string;
  customSort?: (column: TableField<any>, row: any) => string;
}

