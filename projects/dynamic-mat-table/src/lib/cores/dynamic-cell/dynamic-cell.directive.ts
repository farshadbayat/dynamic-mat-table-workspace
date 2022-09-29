import { Compiler, ComponentFactoryResolver, ComponentRef, Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DynamicMatTableComponent } from '../../dynamic-mat-table/dynamic-mat-table.component';
import { TableField } from '../../models/table-field.model';
import { IRowEvent } from '../../models/table-row.model';
import { IDynamicCell } from './IDynamicCell';

@Directive({
  selector: '[dynamicCell]'
})
export class DynamicCellDirective implements OnInit, OnChanges, OnDestroy
{
  @Input() component: any;
  @Input() column: TableField<any>;
  @Input() row: any;
  @Input() onRowEvent: EventEmitter<IRowEvent>;
  componentRef: ComponentRef<IDynamicCell> = null;

  constructor(
    public compiler: Compiler,
    private cfr: ComponentFactoryResolver,
    private vc: ViewContainerRef,
    private parent: DynamicMatTableComponent<any>
  ) { }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (this.componentRef === null || this.componentRef === undefined)
    {
      this.initComponent();
    }
    // pass input parameters
    if (changes.column && changes.column.currentValue)
    {
      this.componentRef.instance.column = this.column;
    }
    if (changes.row && changes.row.currentValue)
    {
      (this.componentRef.instance as any).row = this.row;
    }
    if (changes.onRowEvent && changes.onRowEvent.currentValue)
    {
      (this.componentRef.instance as any).onRowEvent = this.onRowEvent;
    }
  }

  ngOnInit() { }

  ngOnDestroy(): void
  {
    if (this.componentRef)
    {
      this.componentRef.destroy();
    }
  }

  initComponent()
  {
    try
    {
      const componentFactory = this.cfr.resolveComponentFactory<IDynamicCell>(this.component);
      this.componentRef = this.vc.createComponent<IDynamicCell>(componentFactory);
      this.updateInput();
    } catch (e)
    {
      console.warn(e);
    }
  }

  updateInput()
  {
    if (this.parent)
    {
      (this.componentRef.instance as IDynamicCell).parent = this.parent;
    }
    if (this.column)
    {
      this.componentRef.instance.column = this.column;
    }
    if (this.row)
    {
      (this.componentRef.instance as IDynamicCell).row = this.row;
    }
    if (this.onRowEvent)
    {
      (this.componentRef.instance as IDynamicCell).onRowEvent = this.onRowEvent;
    }
  }
}
