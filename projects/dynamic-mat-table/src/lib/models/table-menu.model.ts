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

export interface TableSetting {
  filterMode?: 'client-side' | 'server-side';
  sortMode?: 'client-side' | 'server-side';
  sortable?: boolean;
  filterable?: string;
  columnSetting?: string[];
  visibaleMenuItems: {
    json?: boolean,
    csv?: boolean,
    print?: boolean,
    columnSetting?: boolean,
    saveTableSetting?: boolean,
    clearFilter?: boolean
  };

}
