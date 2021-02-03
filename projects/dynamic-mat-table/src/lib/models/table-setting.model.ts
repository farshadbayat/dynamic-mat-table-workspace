import { TableScrollStrategy } from '../cores/fixed-size-table-virtual-scroll-strategy';
import { AbstractField } from './table-field.model';

export type Direction = 'rtl' | 'ltr';
export type ScreenMode = 'fullscreen' | 'normal' | 'none'  | null;
export interface TableSetting {
  screenMode?: ScreenMode;
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
  scrollStrategy?: TableScrollStrategy;
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
