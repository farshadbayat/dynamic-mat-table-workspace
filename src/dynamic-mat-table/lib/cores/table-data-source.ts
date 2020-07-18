import { BehaviorSubject, combineLatest, merge, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AbstractFilter } from '../dynamic-mat-table/extensions/filter/compare/abstract-filter';
import { OnInit } from '@angular/core';
import { TableCore } from './table.core';
import { Utils } from './utils';


// const CHANGE_STRING = ' ';
export class TableVirtualScrollDataSource<T> extends MatTableDataSource<T> implements OnInit {

  public dataToRender$: Subject<T[]>;
  public dataOfRange$: Subject<T[]>;
  private streamsReady: boolean;
  private filterMap: HashMap<AbstractFilter[]> = {};


  getFilter(fieldName: string): AbstractFilter[] {
    return this.filterMap[fieldName];
  }

  setFilter(fieldName: string, filters: AbstractFilter[]): Observable<null> {
    console.log(fieldName);
    this.filterMap[fieldName] = filters;
    return new Observable(subscriber => {
      setTimeout(() => {
        this.refreshFilterPredicate();
        subscriber.next();
        subscriber.complete();
      }, 200); // for show progress
    });
  }

  clearFilter(fieldName: string = null) {
    if (fieldName != null ) {
      delete this.filterMap[fieldName];
    } else {
      this.filterMap = {};
    }
    this.refreshFilterPredicate();
  }

  clearData() {
    this.data = [];
  }

  public refreshFilterPredicate() {
    let conditionsString = '';
    console.log(this.filterMap);

    Object.keys(this.filterMap).forEach(key => {
      let fieldCondition = '';
      this.filterMap[key].forEach((fieldFilter, row, array) => {
        if (row < array.length - 1) {
          fieldCondition += fieldFilter.toString(key) + (fieldFilter.type === 'and' ? ' && ' : ' || ');
        } else {
          fieldCondition += fieldFilter.toString(key);
        }
      });
      if (fieldCondition !== '') {
        conditionsString += ` ${conditionsString === '' ? '' : ' && '} ( ${fieldCondition} )`;
      }
    });
    if (conditionsString !== '') {
      const filterFunction = new Function('_a$', 'return ' + conditionsString);
      this.filterPredicate = (data: T, filter: string) => filterFunction(data) as boolean;
    } else {
      this.filterPredicate = (data: T, filter: string) => true;
    }
    this.filter = conditionsString; // CHANGE_STRING;
    console.log('refreshFilterPredicate');
  }

  ngOnInit(): void {
  }

  pagingData(data) {
    const p: MatPaginator = (this as any)._paginator;
    if ( p && p !== null) {
      const end = (p.pageIndex + 1) * p.pageSize;
      const start = p.pageIndex * p.pageSize;
      return data.slice(start, end);
    }
    return data;
  }

  _updateChangeSubscription() {
    this.initStreams();
    const sort: MatSort | null = (this as any)._sort;
    const paginator: MatPaginator | null = (this as any)._paginator;
    const internalPageChanges: Subject<void> = (this as any)._internalPageChanges;
    const filter: BehaviorSubject<string> = (this as any)._filter;
    const renderData: BehaviorSubject<T[]> = (this as any)._renderData;
    const dataStream: BehaviorSubject<T[]> = (this as any)._data;

    const sortChange: Observable<Sort | null | void> = sort ?
      merge(sort.sortChange, sort.initialized) as Observable<Sort | void> : of(null);
    const pageChange: Observable<PageEvent | null | void> = paginator ?
      merge(paginator.page, internalPageChanges, paginator.initialized) as Observable<PageEvent | void> : of(null);

    // First Filter
    const filteredData = combineLatest([dataStream, filter]).pipe(map(([data]) => this._filterData(data)));
    // Second Order
    const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
    // Last Paging
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this.pagingData(data)));

    this._renderChangesSubscription.unsubscribe();
    this._renderChangesSubscription = new Subscription();
    this._renderChangesSubscription.add(paginatedData.subscribe(data => this.dataToRender$.next(data)));
    this._renderChangesSubscription.add(this.dataOfRange$.subscribe(data => renderData.next(data)));
  }

  private initStreams() {
    if (!this.streamsReady) {
      this.dataToRender$ = new ReplaySubject<T[]>(1);
      this.dataOfRange$ = new ReplaySubject<T[]>(1);
    }
  }
}

export interface HashMap<T> {
  [key: string]: T;
}
