import { ChangeDetectionStrategy, Component, Output, Input, EventEmitter } from '@angular/core';
import { RowActionMenu } from '../../../models/table-row.model';
import { TableSetting } from '../../../models/table-setting.model';
import { isNull } from '../../../utilies/utils';

@Component({
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
    console.log('s', this.rowActionMenu);
  }

  menuOnClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.visibleActionMenus = [];
    this.actionMenus.forEach(menu => {
      const am: RowActionMenu = isNull(this.rowActionMenu) || isNull(this.rowActionMenu[menu.name]) ? menu : this.rowActionMenu[menu.name];
      if ( isNull(am.visible) || am.visible) {

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

