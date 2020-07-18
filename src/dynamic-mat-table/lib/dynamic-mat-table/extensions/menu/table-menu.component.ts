import { ChangeDetectionStrategy, Component, Output, Input, ElementRef, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TableField, AbstractField } from './../../../models/table-field.model';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableService } from '../../dynamic-mat-table.service';
import { TableSetting, VisibleActionMenu } from '../../../models/table-menu.model';
import { Utils } from 'src/dynamic-mat-table/lib/cores/utils';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent implements OnChanges {
  @Output() menuActionChange: EventEmitter<MenuActionChange> = new EventEmitter<MenuActionChange>();
  @Input()
  get tableSetting(): TableSetting {
    return this.currentTableSetting;
  }
  set tableSetting(value: TableSetting) {
    this.originalTableSetting = value;
    this.reverseDirection = value.direction === 'rtl' ? 'ltr' : 'rtl';
    this.currentTableSetting = Utils.deepClone<TableSetting>(value);
  }

  currentColumn: number = null;
  reverseDirection: string = null;
  originalTableSetting: TableSetting;
  currentTableSetting: TableSetting;

  constructor(private tableService: TableService) {
    console.log('Menu1');
    // console.log(this.tableColumns);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Menu2');
    console.log(changes.tableSetting);
    if (changes.tableSetting.currentValue !== null && changes.tableSetting.currentValue !== undefined) {
      this.currentTableSetting = changes.tableSetting.currentValue;
    }
  }

  /***** Column Setting ******/
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(this.tableSetting.columnSetting, event.item.data.columnIndex, event.currentIndex);
  }

  toggleSelectedColumn(columnIndex: number) {
    const colFound = this.tableSetting.columnSetting.find(col => col.index === columnIndex);
    colFound.display = colFound.display === 'visible' ? 'hiden' : 'visible';
  }

  apply_OnClick(e) {
    e.stopPropagation(); e.preventDefault();
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({
        type: 'TableSetting',
        data: this.currentTableSetting
      });
      this.tableService.saveColumnInfo(this.tableSetting.columnSetting);
    });
  }

  cancel_OnClick() {
    console.log('cancel');
    this.currentTableSetting = Utils.deepClone(this.originalTableSetting);
  }

  /*****  Save ********/
  saveSetting_OnClick() {
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'SaveSetting'});
    });
  }

  /*****  Filter ********/
  clearFilter_OnClick() {
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'FilterClear' });
    });
  }

  /******* Save File ***********/
  download_OnClick(type: string) {
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'Download', data: type});
    });
  }

  print_OnClick(menu) {
    // menu._menuOpen = false;
    console.log(menu);
    menu._overlayRef._host.parentElement.click();
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'Print', data: null});
    });
  }

  radio_onClick(e) {
    e.stopPropagation();
    // e.preventDefault();
    console.log(e);
  }

  columnSetting_onClick(i) {
    console.log(i);
    this.currentColumn = i;
  }
}

export interface MenuActionChange {
  type: 'FilterClear' | 'TableSetting' | 'Download' | 'SaveSetting' | 'Print';
  data?: any;
}
