import { TableScrollStrategy } from "../cores/fixed-size-table-virtual-scroll-strategy";
import { AbstractField } from "./table-field.model";

export type Direction = "rtl" | "ltr";
export type DisplayMode = "visible" | "hidden" | "none";
export interface TableSetting
{
  // screenMode?: ScreenMode;
  pageSize?: number;
  direction?: Direction;
  columnSetting?: AbstractField[];
  visibleActionMenu?: VisibleActionMenu;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
  scrollStrategy?: TableScrollStrategy;
  rowStyle?: any;
  enableContextMenu?: boolean;
  autoHeight?: boolean;
  saveSettingMode?: "simple" | "multi" | "none";
  settingName?: string;
  settingList?: SettingItem[];
}

export interface SettingItem extends TableSetting
{
  isCurrentSetting?: boolean;
  isDefaultSetting?: boolean;
}

export interface VisibleActionMenu
{
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
