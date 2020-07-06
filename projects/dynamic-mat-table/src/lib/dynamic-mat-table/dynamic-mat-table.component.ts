import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { TableCore } from '../cores/table.core';
import { TableService } from './dynamic-mat-table.service';
import { LanguagePack } from '../models/language-pack.model';
import { TableRow } from '../models/table-row.model';
import { TableField } from '../models/table-field.model';
import { AbstractFilter } from './extensions/filter/compare/abstract-filter';
import { MenuActionChange } from './extensions/menu/table-menu.component';


@Component({
  selector: 'dynamic-mat-table',
  templateUrl: './dynamic-mat-table.component.html',
  styleUrls: ['./dynamic-mat-table.component.scss']
})
export class DynamicMatTableComponent<T extends TableRow> extends TableCore<T> implements OnInit, AfterViewInit {
  public languageText: LanguagePack;
  @Input()
  get languagePack() {
    return this.languageText;
  }
  set languagePack(language: LanguagePack) {
    this.languageText = language;
    this.tableService.loadLanguagePack(language);
  }

  constructor(public tableService: TableService) {
    super(tableService);
    tableService.language.subscribe( languagePack => {
        this.languageText = languagePack;
      }
    );
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe( resp => {
      console.log(resp);
    });
    console.log(this.sort);
  }

  ellipsis(cellRef) {
    console.log(cellRef.clientHeight);
    console.log(cellRef.scrollHeight);
    if (cellRef.clientHeight > this.rowHeight) {
      cellRef.style.maxHeight = '48px';
    }
  }

  filter_OnChanged(column: TableField<T>, filter: AbstractFilter[]) {
    this.pending = true;
    this.dataSource.setFilter(column.name, filter).subscribe( () => {
      this.pending = false;
    });
  }

  menuActionChange(e: MenuActionChange) {
    console.log(e);
    if (e.type === 'ColumnSetting') {
      this.refreshColumn(e.data);
    } else if (e.type === 'Download') {
      if (e.data === 'CSV') {
        this.tableService.exportToCsv(this.dataSource.filteredData, this.rowSelection);
      } else if (e.data === 'JSON') {
        this.tableService.exportToJson(this.dataSource.filteredData);
      }
    } else if (e.type === 'FilterClear') {
      this.dataSource.clearFilter();
      this.headerFilterList.forEach( hf => hf.clearColumn_OnClick() );
    }
  }
}
