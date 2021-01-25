import { AbstractField } from './table-field.model';

export type Direction = 'rtl' | 'ltr';
export type ScreenMode = 'fullscreen' | 'normal' | 'none';
export interface TableSetting {
  screenMode?: ScreenMode;
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
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
