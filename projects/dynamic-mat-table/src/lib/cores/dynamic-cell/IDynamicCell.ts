import { EventEmitter } from '@angular/core';
import { DynamicMatTableComponent } from '../../dynamic-mat-table/dynamic-mat-table.component';
import { TableField } from '../../models/table-field.model';
import { IEvent } from '../../models/table-row.model';
export interface IDynamicCell {
  row: any;
  column: TableField<any>;
  parent: DynamicMatTableComponent<any>;
  onRowEvent?: EventEmitter<IEvent>;
}
