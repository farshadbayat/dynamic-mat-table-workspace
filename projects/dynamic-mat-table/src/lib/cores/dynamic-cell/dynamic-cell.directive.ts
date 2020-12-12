import { Compiler, ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { TableField } from '../../models/table-field.model';
import { IDynamicCell } from './IDynamicCell';

@Directive({
  selector: '[dynamicCell]'
})
export class DynamicCellDirective implements OnInit {

  @Input() component: any;
  @Input() column: TableField<any>;
  @Input() row: any;

  constructor(public compiler: Compiler,private cfr: ComponentFactoryResolver, private vc: ViewContainerRef) {}

  async ngOnInit() {
    try{
      const componentFactory = this.cfr.resolveComponentFactory<IDynamicCell>(this.component);
      const component = this.vc.createComponent<IDynamicCell>(componentFactory);
      if (this.column) {
        component.instance.column = this.column;
      }
      if (this.row) {
        (component.instance as any).row = this.row;
      }
    } catch (e) {
      console.log(e);
    }
  }

}


export interface CellData {
  component: any;
  columnDef: any;
  row: any;
}
