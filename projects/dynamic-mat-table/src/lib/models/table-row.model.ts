export interface TableRow {
  id?: number;
  isOpen?: boolean;
  rowClass?: string;
}

export type TableSelectionMode = 'single' | 'multi' | 'none';
