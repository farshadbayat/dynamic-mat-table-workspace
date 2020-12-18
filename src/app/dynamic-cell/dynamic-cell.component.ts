import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { DynamicMatTableComponent, IDynamicCell, TableField, IEvent } from 'dynamic-mat-table';

@Component({
  selector: 'app-dynamic-cell',
  templateUrl: './dynamic-cell.component.html'
})
export class DynamicCellComponent implements OnInit, OnDestroy, IDynamicCell {
  @Input() onRowEvent: EventEmitter<IEvent>;  
  @Input() row: any;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('ss');    
  }

  expandRow_onClick() {
    // this.row.option.expand = !this.row.option.expand;
    if (!this.row.option) {
      this.row.option = {expand: false};
    } else if (!this.row.option.expand) {
      this.row.option.expand = false;
    }
    this.parent.expandRow(this.row.row - 1, !this.row.option.expand);
    
  }

  raiseEvent_onClick() {
    this.onRowEvent.emit({event: { name: 'test', data: 'any thing from row ' + this.row.row}, sender:  this })
  }

}
