import { ThemePalette } from '@angular/material/core';

export interface RowActionMenu {
  name: string;
  text: string;
  color: ThemePalette;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
}
export interface TableRow {
  id?: number;
  isOpen?: boolean;
  rowClass?: string;
}

export type TableSelectionMode = 'single' | 'multi' | 'none';
