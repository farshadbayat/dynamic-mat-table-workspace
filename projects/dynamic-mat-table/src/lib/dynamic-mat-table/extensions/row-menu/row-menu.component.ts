import { ChangeDetectionStrategy, Component, Output, Input, EventEmitter } from '@angular/core';
import { RowActionMenu } from '../../../models/table-row.model';
import { TableSetting } from '../../../models/table-setting.model';

@Component({
  selector: 'row-menu',
  templateUrl: './row-menu.component.html',
  styleUrls: ['./row-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowMenuComponent {
  @Output() rowActionChange: EventEmitter<RowActionMenu> = new EventEmitter<RowActionMenu>();
  @Input() rowActionMenus: RowActionMenu[] = [];
  @Input() tableSetting: TableSetting;

  constructor() {
  }

  menuButton_OnClick(menu: RowActionMenu) {
    window.requestAnimationFrame(() => {
      this.rowActionChange.emit(menu);
    });
  }
}

