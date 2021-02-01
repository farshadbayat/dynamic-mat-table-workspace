import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { DynamicMatTableComponent, IDynamicCell, TableField, IRowEvent } from 'dynamic-mat-table';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dynamic-cell',
  templateUrl: './dynamic-cell.component.html'
})
export class DynamicCellComponent implements OnInit, OnDestroy, IDynamicCell {

  @Input() onRowEvent: EventEmitter<IRowEvent>;  
  @Input() row: any;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onSignal: BehaviorSubject<any>;

  ngOnInit(): void {
    // if (this.onSignal) {
    //   this.onSignal.subscribe( resp => {
    //     console.log(resp);        
    //   });
    // }
  }

  ngOnDestroy(): void {
    // console.log('ss');    
  }

  expandRow_onClick() {
    // this.row.option.expand = !this.row.option.expand;
    if (!this.row.option) {
      this.row.option = {expand: false};
    } else if (!this.row.option.expand) {
      this.row.option.expand = false;
    }
    this.parent.expandRow(this.row.row - 1, !this.row.option.expand);    
    if (this.row.option.expandCallback !== undefined) {
      this.row.option.expandCallback(this.row);
    }
  }

  raiseEvent_onClick() {
    this.onRowEvent.emit({event: { name: 'test', data: 'any thing from row ' + this.row.row}, sender:  this })
  }

  moveDown_onClick() {    
    const id = this.row.id;
    this.parent.moveRow(id, id+1 );
    this.onRowEvent.emit({ sender: this.row, event: 'moveDown' });
  }
 
  moveUp_onClick() {    
    const id = this.row.id;
    this.parent.moveRow(id, id-1 );
  }

}
