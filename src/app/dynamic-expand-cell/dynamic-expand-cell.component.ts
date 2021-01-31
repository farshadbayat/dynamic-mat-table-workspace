import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DynamicMatTableComponent, IDynamicCell, IEvent, TableField } from 'dynamic-mat-table';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dynamic-expand-cell',
  templateUrl: './dynamic-expand-cell.component.html',
  styleUrls: ['./dynamic-expand-cell.component.scss']
})
export class DynamicExpandCellComponent implements OnInit, IDynamicCell {
  @Input() row: any;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onRowEvent?: EventEmitter<IEvent>;  

  constructor() { }
  
  ngOnInit() {
  }

}
