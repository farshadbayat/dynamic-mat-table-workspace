import { Component, Input, OnInit } from '@angular/core';
import { IDynamicCell, TableField } from 'dynamic-mat-table';

@Component({
  selector: 'app-dynamic-cell',
  templateUrl: './dynamic-cell.component.html'
})
export class DynamicCellComponent implements OnInit, IDynamicCell {
  @Input() row: any;
  @Input() column: TableField<any>;
  @Input() callback: (args: any) => void;

  ngOnInit(): void {
    console.log(this.row.row);
    
  }

  test_onClick() {
    console.log(this.column);
    
  }

}
