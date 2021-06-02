import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DynamicMatTableComponent, IDynamicCell, IRowEvent, TableField, TableRow } from 'projects/dynamic-mat-table/src/public-api';

@Component({
  selector: 'app-formly-cell',
  templateUrl: './formly-cell.component.html',
  styleUrls: ['./formly-cell.component.scss']
})
export class FormlyCellComponent implements OnInit, IDynamicCell {

  constructor() { }

  @Input() row: TableRow;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onRowEvent?: EventEmitter<IRowEvent>;

  /****************/
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};  
  fields: FormlyFieldConfig[] = [
    {
      key: 'FormlyColumn',
      type: 'input',
      templateOptions: {       
        placeholder: 'Input placeholder',
        required: true,
      }
    }
  ];
  ngOnInit() {    
  }

}
