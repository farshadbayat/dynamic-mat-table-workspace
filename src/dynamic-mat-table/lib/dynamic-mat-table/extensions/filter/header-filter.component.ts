import {
  AfterViewInit, ChangeDetectionStrategy, Component, HostBinding,
  Output,
  ViewChild,
  Input,
  EventEmitter,
  OnInit,
  OnChanges,
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatInput, MatMenuTrigger } from '@angular/material';
import { TableField } from './../../../models/table-field.model';
import { LanguagePack } from './../../../models/language-pack.model';
import { TableService } from '../../dynamic-mat-table.service';
import { TextFilter } from './compare/text-filter';
import { NumberFilter } from './compare/number-filter';
import { AbstractFilter } from './compare/abstract-filter';
import { transition, trigger, query, style, stagger, animate } from '@angular/animations';
import { TableCore } from 'projects/dynamic-mat-table/src/lib/cores/table.core';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('10ms', animate('400ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
  ])
]);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'header-filter',
  templateUrl: './header-filter.component.html',
  styleUrls: ['./header-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [listAnimation]
})
export class HeaderFilterComponent implements OnInit, AfterViewInit {
  @Input() field?: TableField<any>;
  // tslint:disable-next-line:no-output-native
  @Output() change = new EventEmitter<AbstractFilter[]>();

  @ViewChildren('filterInput') filterInputList: QueryList<MatInput>;
  @ViewChild(MatMenuTrigger, { static: true }) menu: MatMenuTrigger;

  @Input() filterList: AbstractFilter[] = [];


  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return this.filterList.filter( f => f.hasValue() === true).length > 0;
  }

  @HostBinding('class.show-trigger')
  get showTrigger(): boolean {
    return this.menu.menuOpen || this.hasValue;
  }

  language: LanguagePack;
  constructor(public service: TableService, private cdr: ChangeDetectorRef) {
    service.language.subscribe(languagePack => {
      this.language = languagePack;
    });
  }

  ngOnInit(): void {
    if (TableCore.isNull(this.filterList)) {
      this.filterList = [];
      this.addNewFilter(this.field.type);
    }
  }

  addNewFilter(type: string = 'text') {
    switch (type || 'text') {
      case 'text': {
        this.filterList.push(new TextFilter(this.service));
        break;
      }
      case 'number': {
        this.filterList.push(new NumberFilter(this.service));
        break;
      }
      case 'date': {
        // this.compare = new DateCompare(service);
        break;
      }
      case 'boolean': {
        // this.compare = new BooleanCompare(service);
        break;
      }
      default: this.filterList.push(new TextFilter(this.service));
    }
    this.filterList[this.filterList.length - 1].selectedIndex = 0;
    return this.filterList[this.filterList.length - 1];
  }

  ngAfterViewInit() {
    this.menu.menuOpened.subscribe(() => this.focusToLastInput());
  }

  focusToLastInput() {
    window.requestAnimationFrame(() => {
      if (this.filterInputList.length > 0) {
        this.filterInputList.last.focus();
      }
    });
  }

  filterAction_OnClick(index, action) {
    if (action === 0 || action === 1) { // and or
      this.filterList[index].type = action === 0 ? 'and' : 'or';
      if (this.filterList.length === index + 1) {
        this.addNewFilter(this.field.type);
        this.focusToLastInput();
      }
    } else if (action === 2 && this.filterList.length > 1) { // delete
      window.requestAnimationFrame(() => {
        this.filterList.splice(index, 1);
        this.cdr.detectChanges();
        this.focusToLastInput();
      }); // bug for delete filter item(unwanted reaction close menu)
    }
  }

  // getFilterTypeSelected(filterType: AbstractFilter, type: string) {
  //   if ((filterType.selectedIndex === null && type === 'and') || (filterType.selectedIndex !== null && filterType.type === type)) {
  //     return 'primary';
  //   } else {
  //     return null;
  //   }
  // }


  clearColumn_OnClick() {
    this.filterList = [];
    this.addNewFilter(this.field.type || 'text');
    this.change.emit(this.filterList);
  }

  applyFilter_OnClick() {
    console.log(this.filterList.filter( f => f.hasValue() === true));
    this.change.emit(this.filterList);
  }

}

