import { AbstractField } from './table-field.model';
import { VisibleActionMenu } from './table-menu.model';

export type Direction = 'rtl' | 'ltr';
export interface TableSetting {
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
}
