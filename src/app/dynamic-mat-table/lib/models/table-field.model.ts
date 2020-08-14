import { TableRow } from './table-row.model';

export declare type AtRenderFunc<R extends TableRow> = (row: R) => string;
export declare type AtClassFunc = (row: any, col: any) => string;
export declare type AtSortFunc<R extends TableRow> = (data: R[], col: any) => string;
export declare type AtFilterFunc<R extends TableRow> = (data: R[], col: any) => string;
export interface TableField<R extends TableRow> extends AbstractField {
    renderer?: AtRenderFunc<R>;
    classNames?: string;
    rowClass?: string | AtClassFunc;
    customSortFunction?: AtSortFunc<R>;
    customFilterFunction?: AtSortFunc<R>;
}

export interface AbstractField {
  index?: number;
  name: string;
  type?: 'text' | 'number' | 'date' | 'category';
  width?: number;
  header?: string;
  print?: boolean;
  isKey?: boolean;
  inlineEdit?: boolean;
  display?: 'visible' | 'hiden' | 'prevent-hidden';
  sticky?: 'start' | 'end' | 'none';
  filter?: 'client-side' | 'server-side' | 'none';
  sort?: 'client-side' | 'server-side' | 'none';
  cellClass?: string;
}

