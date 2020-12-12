import { ChangeDetectionStrategy, Component, Output, Input, EventEmitter } from '@angular/core';
import { isNullorUndefined } from '../../../cores/type';
import { RowActionMenu } from '../../../models/table-row.model';
import { TableSetting } from '../../../models/table-setting.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'row-menu',
  templateUrl: './row-menu.component.html',
  styleUrls: ['./row-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowMenuComponent<T> {
  @Output() rowActionChange: EventEmitter<RowActionMenu> = new EventEmitter<RowActionMenu>();
  @Input() actionMenus: RowActionMenu[] = [];
  @Input() tableSetting: TableSetting;
  @Input() rowActionMenu?: { [key: string]: RowActionMenu; };
  visibleActionMenus: RowActionMenu[] = [];

  constructor() {
  }

  menuOnClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.visibleActionMenus = [];
    this.actionMenus.forEach(menu => {
      const am: RowActionMenu = isNullorUndefined(this.rowActionMenu) || isNullorUndefined(this.rowActionMenu[menu.name]) ? menu : this.rowActionMenu[menu.name];
      if ( isNullorUndefined(am.visible) || am.visible) {

        this.visibleActionMenus.push({
          name: menu.name,
          text: am.text || menu.text,
          disabled: am.disabled || menu.disabled,
          icon: am.icon || menu.icon,
          color: am.color || menu.color
        });
      }
    });

  }


  menuButton_OnClick(menu: RowActionMenu) {
    window.requestAnimationFrame(() => {
      this.rowActionChange.emit(menu);
    });
  }

  // first priority is for attribute in data and then is  in global action menu
  // getIcon(actionMenu: RowActionMenu) {
  //   return ((this.rowData[actionMenu.name] as RowActionMenu) || actionMenu).icon;
  // }

  // getColor(actionMenu: RowActionMenu) {
  //   return ((this.rowData[actionMenu.name] as RowActionMenu) || actionMenu).color;
  // }

  // getDisabled(actionMenu: RowActionMenu) {
  //   return ((this.rowData[actionMenu.name] as RowActionMenu) || actionMenu).disabled;
  // }

  // getText(actionMenu: RowActionMenu) {
  //   return ((this.rowData[actionMenu.name] as RowActionMenu) || actionMenu).text;
  // }
}

