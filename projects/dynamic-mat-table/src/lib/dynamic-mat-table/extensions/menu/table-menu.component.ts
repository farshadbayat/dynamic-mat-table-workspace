import { ChangeDetectionStrategy, Component, Output, Input, ElementRef, EventEmitter, OnChanges } from '@angular/core';
import { TableField } from './../../../models/table-field.model';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { TableService } from '../../dynamic-mat-table.service';

@Component({
  selector: 'table-menu',
  templateUrl: './table-menu.component.html',
  styleUrls: ['./table-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMenuComponent {
  private tableColumns: TableField<any>[] = [];
  @Output() menuActionChange: EventEmitter<MenuActionChange> = new EventEmitter<MenuActionChange>();
  @Input()
  get columnInfo(): TableField<any>[] {
    return this.tableColumns;
  }
  set columnInfo(values: TableField<any>[]) {
    console.log(values);
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
      this.menuActionChange.emit({ type: 'ColumnSetting', data: this.tableColumns });
      this.tableService.saveColumnInfo(this.tableColumns);
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
      this.menuActionChange.emit({ type: 'Download' , data: type});
    });
  }

}

export interface MenuActionChange {
  type: 'FilterClear' | 'ColumnSetting' | 'Download';
  data?: any;
}
