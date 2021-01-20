import { ChangeDetectionStrategy, Component, Output, Input, EventEmitter } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableService } from '../../dynamic-mat-table.service';
import { TableSetting } from '../../../models/table-setting.model';
import { TableIntl } from '../../../international/table-Intl';
import { clone, deepClone, isNullorUndefined } from '../../../cores/type';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent {
  @Output() menuActionChange: EventEmitter<MenuActionChange> = new EventEmitter<MenuActionChange>();
  @Input()
  get tableSetting(): TableSetting {
    return this.currentTableSetting;
  }
  set tableSetting(value: TableSetting) {
    this.originalTableSetting = value;
    this.reverseDirection = value.direction === 'rtl' ? 'ltr' : 'rtl';
    this.currentTableSetting = clone<TableSetting>(value);
  }

  currentColumn: number = null;
  reverseDirection: string = null;
  originalTableSetting: TableSetting;
  currentTableSetting: TableSetting;

  constructor(public languagePack: TableIntl, public tableService: TableService) {
  }

  screenMode_OnClick() {
    this.currentTableSetting.screenMode = this.currentTableSetting.screenMode === 'fullscreen' ? 'normal' : 'fullscreen';
    this.menuActionChange.emit({
      type: 'TableSetting',
      data: this.currentTableSetting,
    });
  }

  /***** Column Setting ******/
  columnMenuDropped(event: CdkDragDrop<any>): void {
    moveItemInArray(
      this.currentTableSetting.columnSetting,
      event.item.data.columnIndex,
      event.currentIndex
    );
  }

  toggleSelectedColumn(columnIndex: number) {
    const colFound = this.currentTableSetting.columnSetting.find(
      (col) => col.index === columnIndex
    );
    colFound.display = colFound.display === 'visible' ? 'hiden' : 'visible';
  }

  apply_OnClick(e) {
    e.stopPropagation();
    e.preventDefault();
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({
        type: 'TableSetting',
        data: this.currentTableSetting,
      });
      this.tableService.saveColumnInfo(this.currentTableSetting.columnSetting);
    });
  }

  setting_onClick(i) {
    this.currentColumn = i;
  }

  cancel_OnClick() {
    this.currentTableSetting = deepClone(this.originalTableSetting);
  }

  isVisible(visible: boolean) {
    return isNullorUndefined(visible) ? true : visible;
  }

  /*****  Save ********/
  saveSetting_OnClick() {
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'SaveSetting' });
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
      this.menuActionChange.emit({ type: 'Download', data: type });
    });
  }

  print_OnClick(menu) {
    menu._overlayRef._host.parentElement.click();
    window.requestAnimationFrame(() => {
      this.menuActionChange.emit({ type: 'Print', data: null });
    });
  }
}

export interface MenuActionChange {
  type: 'FilterClear' | 'TableSetting' | 'Download' | 'SaveSetting' | 'Print' | 'ScreenMode';
  data?: any;
}
