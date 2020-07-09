import { TableRow } from './table-row.model';

export type AtRenderFunc<R extends TableRow> = (row: R) => string;
export type AtClassFunc = (row: any, col: any) => string;
export type AtSortFunc<R extends TableRow> = (data: R[], col: any) => string;
export type AtFilterFunc<R extends TableRow> = (data: R[], col: any) => string;

export interface TableField<R extends TableRow> extends TableFieldSetting {
  index?: number;
  name: string;
  type?: 'text' | 'number' | 'date' | 'boolean';
  categoryType?: boolean;
  preventHidden?: boolean; // prevent from invisible column
  renderer?: AtRenderFunc<R>;
  classNames?: string;
  rowClass?: string | AtClassFunc;
  customSortFunction?: AtSortFunc<R>;
  customFilterFunction?: AtSortFunc<R>;
}

export interface TableFieldSetting {
  header?: string;
  sort?: {type?: 'enable' | 'disable' | 'custom'};
  filter?: 'enable' | 'disable';
  sticky?: 'start' | 'end' | 'none';
  isKey?: boolean;
  inlineEdit?: boolean;
  hidden?: boolean;
}

