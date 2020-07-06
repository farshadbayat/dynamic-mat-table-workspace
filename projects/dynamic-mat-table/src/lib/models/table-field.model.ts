import { TableRow } from './table-row.model';

export type AtRenderFunc<R extends TableRow> = (row: R) => string;
export type AtClassFunc = (row: any, col: any) => string;
export type AtSortFunc<R extends TableRow> = (data: R[], col: any) => string;

export interface TableField<R extends TableRow> {
  index?: number;
  name: string;
  header?: string;
  type?: 'text' | 'number' | 'date' | 'boolean';
  categoryType?: boolean;
  sort?: {type?: 'enable' | 'disable' | 'custom', sortFunction?: AtSortFunc<R>};
  filter?: 'enable' | 'disable';
  sticky?: 'start' | 'end' | 'none';
  isKey?: boolean;
  inlineEdit?: boolean;
  hidden?: boolean;
  preventHidden?: boolean;
  renderer?: AtRenderFunc<R>;
  classNames?: string;
  rowClass?: string | AtClassFunc;
}
