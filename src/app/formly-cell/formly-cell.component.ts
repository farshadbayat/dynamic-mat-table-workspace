import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DynamicMatTableComponent, IDynamicCell, IRowEvent, TableField, TableRow } from 'projects/dynamic-mat-table/src/public-api';

@Component({
  selector: 'app-formly-cell',
  templateUrl: './formly-cell.component.html',
  styleUrls: ['./formly-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyCellComponent implements OnInit, IDynamicCell, AfterContentInit {

  constructor(public cdr: ChangeDetectorRef) { }
  
  
  ngAfterContentInit(): void {
    // setTimeout(() =>{this.cdr.detectChanges();},1)    

    this.fields = [{
          key: 'FormlyColumn',
          type: 'input',
          templateOptions: {       
            placeholder: 'Input placeholder',
            required: true,
          }
      },
    ];    
  }

  @Input() row: TableRow;
  @Input() column: TableField<any>;
  @Input() parent: DynamicMatTableComponent<any>;
  @Input() onRowEvent?: EventEmitter<IRowEvent>;

  /****************/
  form = new FormGroup({});
  model :any = {};
  options: FormlyFormOptions = {};  
  fields: FormlyFieldConfig[] = [];
  ngOnInit() { 
    setTimeout(() =>{this.cdr.detectChanges();}, 100);   
    // console.log('-----------');    
    // console.log(this.row);
    // console.log('-----------');
  }

}
