import { AfterViewInit, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DynamicMatTableComponent, IDynamicCell, IRowEvent, TableField } from 'dynamic-mat-table';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dynamic-expand-cell',
  templateUrl: './dynamic-expand-cell.component.html',
  styleUrls: ['./dynamic-expand-cell.component.scss']
})
export class DynamicExpandCellComponent implements OnInit, IDynamicCell, AfterViewInit {
  @Input() row: any;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onRowEvent?: EventEmitter<IRowEvent>;  

  constructor() { }
  
  ngAfterViewInit(): void {
    
  }
  
  ngOnInit() {        
    
    if( this.row) {             
      this.row.option.expandCallback = (data) =>{
        console.log('expand ', data);  
        console.log(this.row);
        console.log(this.column);
        console.log(this.parent);      
      };
    }
  }



}
