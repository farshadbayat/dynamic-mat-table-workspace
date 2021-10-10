import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynamicMatTableComponent } from '../../dynamic-mat-table/dynamic-mat-table.component';
import { TableField } from '../../models/table-field.model';
import { IRowEvent, TableRow } from '../../models/table-row.model';
export interface IDynamicCell {
  row: TableRow ;
  column: TableField<any>;
  parent: DynamicMatTableComponent<any>;
  onRowEvent?: EventEmitter<IRowEvent>;
  //onSignal?: BehaviorSubject<any>;  
  // signal?: (sender: IDynamicCell, e: any) => void;
}
