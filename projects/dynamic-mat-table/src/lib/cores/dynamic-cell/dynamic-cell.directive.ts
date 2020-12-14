import { Compiler, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { DynamicMatTableComponent } from '../../dynamic-mat-table/dynamic-mat-table.component';
import { TableField } from '../../models/table-field.model';
import { IEvent } from '../../models/table-row.model';
import { IDynamicCell } from './IDynamicCell';

@Directive({
  selector: '[dynamicCell]'
})
export class DynamicCellDirective implements OnInit, OnChanges {
  @Input() component: any;
  @Input() column: TableField<any>;
  @Input() row: any;
  @Input() onRowEvent: EventEmitter<IEvent>;
  componentRef: ComponentRef<IDynamicCell> = null;

  constructor(
    public compiler: Compiler,
    private cfr: ComponentFactoryResolver,
    private vc: ViewContainerRef,
    private parent: DynamicMatTableComponent<any>
    ) {}  

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef === null || this.componentRef === undefined) {
      this.initComponent();
    }    
    // pass input parameters
    if (changes.column && changes.column.currentValue) {
      this.componentRef.instance.column = this.column;
    }    
    if (changes.row && changes.row.currentValue) {
      (this.componentRef.instance as any).row = this.row;
    }
    if (changes.onRowEvent && changes.onRowEvent.currentValue) {
      (this.componentRef.instance as any).onRowEvent = this.onRowEvent;
    }
  }

  ngOnInit() {}

  initComponent() {
    try{
      const componentFactory = this.cfr.resolveComponentFactory<IDynamicCell>(this.component);
      this.componentRef = this.vc.createComponent<IDynamicCell>(componentFactory);
      this.updateInput();
    } catch (e) {
      console.log(e);
    }
  }

  updateInput() {
    if (this.column) {
      this.componentRef.instance.column = this.column;
    }   
    if (this.row) {
      (this.componentRef.instance as any).row = this.row;
    }
    if (this.onRowEvent) {
      (this.componentRef.instance as any).onRowEvent = this.onRowEvent;
    }
    if (this.parent) {
      (this.componentRef.instance as any).parent = this.parent;
    }
  }
}
