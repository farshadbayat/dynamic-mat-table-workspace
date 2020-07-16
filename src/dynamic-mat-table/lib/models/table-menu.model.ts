import { AbstractField } from './table-field.model';

export interface TableMenu {
  enable?: boolean;
  menuItems?: MenuItem[];
  columnOrder?: boolean;
  csvExport?: boolean;
}

export interface MenuItem {
  name: string;
  text: string;
  matIcon?: string;
  tag?: any;
}

export interface VisibleActionMenu {
  json?: boolean;
  csv?: boolean;
  print?: boolean;
  columnSettingPin?: boolean;
  columnSettingOrder?: boolean;
  columnSettingFilterMode?: boolean;
  columnSettingSortMode?: boolean;
  saveTableSetting?: boolean;
  clearFilter?: boolean;
}

export interface TableSetting {
  direction?: 'rtl' | 'ltr';
  columnSetting?: AbstractField[];
  visibaleActionMenu?: VisibleActionMenu;
}


