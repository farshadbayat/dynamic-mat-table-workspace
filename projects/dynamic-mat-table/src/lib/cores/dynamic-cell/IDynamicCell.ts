import { TableField } from '../../models/table-field.model';

export interface IDynamicCell {
  row: any;
  column: TableField<any>;
  callback: (args: any) => void;
}
