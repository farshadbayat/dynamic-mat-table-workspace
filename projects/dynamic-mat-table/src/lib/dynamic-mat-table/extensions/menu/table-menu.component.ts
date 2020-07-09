import { ChangeDetectionStrategy, Component, Output, Input, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { TableField } from './../../../models/table-field.model';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableService } from '../../dynamic-mat-table.service';
import { TableSetting } from '../../../models/table-menu.model';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent {
  private tableColumns: TableField<any>[] = [];
  public tableSetting: TableSetting = { visibaleMenuItems: {} , filterMode: 'client-side', sortMode: 'client-side' };
  @Output() menuActionChange: EventEmitter<MenuActionChange> = new EventEmitter<MenuActionChange>();
  @Input()
  get columnInfo(): TableField<any>[] {
    return this.tableColumns;
  }
  set columnInfo(values: TableField<any>[]) {
    if (this.tableColumns.length === 0) {
      this.tableColumns = values.map(x => Object.assign({}, x));
    }
  }

  constructor(private tableService: TableService) { }

  /***** Column Setting ******/
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(this.tableColumns, event.item.data.columnIndex, event.currentIndex);
  }

  toggleSelectedColumn(columnIndex: number) {
    const colFound = this.tableColumns.find(col => col.index === columnIndex);
    colFound.hidden = !colFound.hidden;
  }
  apply_OnClick(e) {
    e.stopPropagation(); e.preventDefault();
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({
        type: 'ColumnSetting',
        data: {columnOrder: this.tableColumns, tableSetting: this.tableSetting }
      });
      this.tableService.saveColumnInfo(this.tableColumns);
    });
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
}

export interface MenuActionChange {
  type: 'FilterClear' | 'ColumnSetting' | 'Download' | 'SaveSetting' | 'Print';
  data?: any;
}
