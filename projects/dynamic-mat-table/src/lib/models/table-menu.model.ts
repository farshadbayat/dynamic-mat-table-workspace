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
  columnSettingFilter?: boolean;
  columnSettingSort?: boolean;
  columnSettingPrint?: boolean;
  saveTableSetting?: boolean;
  clearFilter?: boolean;
}




