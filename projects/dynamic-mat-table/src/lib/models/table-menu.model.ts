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
