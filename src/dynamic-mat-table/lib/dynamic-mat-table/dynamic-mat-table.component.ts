import { Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { TableCore } from '../cores/table.core';
import { TableService } from './dynamic-mat-table.service';
import { LanguagePack } from '../models/language-pack.model';
import { TableRow } from '../models/table-row.model';
import { TableField } from '../models/table-field.model';
import { AbstractFilter } from './extensions/filter/compare/abstract-filter';
import { MenuActionChange } from './extensions/menu/table-menu.component';
import { TablePagination } from '../models/table-pagination.model';
import { HeaderFilterComponent } from './extensions/filter/header-filter.component';
import { Utils } from '../cores/utils';


@Component({
  selector: 'dynamic-mat-table',
  templateUrl: './dynamic-mat-table.component.html',
  styleUrls: ['./dynamic-mat-table.component.scss']
})
export class DynamicMatTableComponent<T extends TableRow> extends TableCore<T> implements OnInit, AfterViewInit {
  @ViewChildren(HeaderFilterComponent) headerFilterList: QueryList<HeaderFilterComponent>;
  public languageText: LanguagePack;
  printing = true;
  @Input()
  get languagePack() {
    return this.languageText;
  }
  set languagePack(language: LanguagePack) {
    this.languageText = language;
    this.tableService.loadLanguagePack(language);
  }

  constructor(public tableService: TableService, public cdr: ChangeDetectorRef) {
    super(tableService, cdr);
    tableService.language.subscribe(languagePack => {
      this.languageText = languagePack;
    }
    );

  }

  ngAfterViewInit(): void {
    this.dataSource.sort.sortChange.subscribe(resp => {
      console.log(resp);
      this.pagination.pageIndex = 0;
    });
    this.dataSource.dataOfRange$.subscribe(data => {
      console.log('dataOfRange');
    });
  }

  ngOnInit() {
  }

  ellipsis(cellRef) {
    console.log(cellRef.clientHeight);
    console.log(cellRef.scrollHeight);
    if (cellRef.clientHeight > this.rowHeight) {
      cellRef.style.maxHeight = '48px';
    }
  }

  filter_OnChanged(column: TableField<T>, filter: AbstractFilter[]) {
    console.log('Change filter');

    this.pending = true;
    this.dataSource.setFilter(column.name, filter).subscribe(() => {
      this.pending = false;
    });
  }

  menuActionChange(e: MenuActionChange) {
    console.log(e);
    if (e.type === 'TableSetting') {
      // this.refreshColumn(e.data.columnSetting);
      this.saveSetting(e.data, false);
    } else if (e.type === 'Download') {
      if (e.data === 'CSV') {
        this.tableService.exportToCsv(this.dataSource.filteredData, this.rowSelection);
      } else if (e.data === 'JSON') {
        this.tableService.exportToJson(this.dataSource.filteredData);
      }
    } else if (e.type === 'FilterClear') {
      this.dataSource.clearFilter();
      this.headerFilterList.forEach(hf => hf.clearColumn_OnClick());
    } else if (e.type === 'Print') {
      this.printing = true;
      setTimeout(() => {
        window.print();
        this.printing = false;
      }, 50);
    } else if (e.type === 'SaveSetting') {
      this.saveSetting(null, true);
    }
  }

  doRendering(e) {
    this.pending = false;
    // console.log(e);
  }

  pagination_onChange(e: TablePagination) {
    this.pending = true;
    this.dataSource.refreshFilterPredicate(); // pagination Bugfixed
    this.paginationChange.emit(e);
  }
}
