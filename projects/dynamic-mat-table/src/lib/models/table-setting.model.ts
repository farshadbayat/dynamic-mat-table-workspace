import { AbstractField } from './table-field.model';

export type Direction = 'rtl' | 'ltr';
export interface TableSetting {
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
}

export interface VisibleActionMenu {
  json?: boolean;
  csv?: boolean;
  print?: boolean;
  columnSettingPin?: boolean;
  columnSettingOrder?: boolean;
  columnSettingFilter?: boolean;
  columnSettingSort?: boolean;
  columnSettingPrint?: boolean;
  saveTableSetting?: boolean;
  clearFilter?: boolean;
}
