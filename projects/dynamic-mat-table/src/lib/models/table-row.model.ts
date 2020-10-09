import { ThemePalette } from '@angular/material/core';

// this fields are for each row data
export interface TableRow {
  id?: number;
  isOpen?: boolean;
  rowClass?: string;
  style?: string;
  actionMenu?: { [key: string]: RowActionMenu; };
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
