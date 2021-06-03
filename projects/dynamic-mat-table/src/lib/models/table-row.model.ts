import { Dictionary } from '../cores/type';
import { ContextMenuItem } from './context-menu.model';

// this fields are for each row data
export interface TableRow {
  id?: number;  
  rowActionMenu?: { [key: string]: ContextMenuItem; };
  option?: RowOption;
}



export type TableSelectionMode = 'single' | 'multi' | 'none';
export type RowEventType = 'MasterSelectionChange' | 'RowSelectionChange' | 'RowActionMenu' | 'RowClick' | 'CellClick' | 'BeforContextMenuOpen' | 'ContextMenuClick';

export interface IRowEvent {
  event: RowEventType | any;
  sender: any;
}

export interface ITableEvent {
  event: 'ReloadData' | any;
  sender: any | undefined;
}

export interface IRowActionMenuEvent<T> {
  actionItem: ContextMenuItem;
  rowItem: T;
}

export interface RowOption extends Dictionary<any> {
  style?: any;
  class?: any; 
  selected?: boolean;
  expand?: boolean; 
}