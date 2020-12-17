import { ThemePalette } from '@angular/material/core';
import { Dictionary } from '../cores/type';

// this fields are for each row data
export interface TableRow {
  id?: number;  
  rowActionMenu?: { [key: string]: RowActionMenu; };
  option?: RowOption;
}

export interface RowActionMenu {
  name: string;
  text: string;
  color: ThemePalette;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
}


export type TableSelectionMode = 'single' | 'multi' | 'none';

export interface IEvent {
  event: any | 'MasterSelectionChange' | 'RowSelectionChange';
  sender: any;
}

export interface IRowActionMenuEvent<T> {
  actionItem: RowActionMenu;
  rowItem: T;
}

export interface RowOption extends Dictionary<any> {
  style?: any;
  class?: any; 
  expand?: boolean; 
}