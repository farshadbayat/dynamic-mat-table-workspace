import { AfterContentInit, ContentChild, Directive, forwardRef,
         Input, NgZone, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { TableVirtualScrollDataSource } from './table-data-source';
import { MatTable } from '@angular/material/table';
import { FixedSizeTableVirtualScrollStrategy } from './fixed-size-table-virtual-scroll-strategy';
import { CdkHeaderRowDef } from '@angular/cdk/table';
import { Subject } from 'rxjs';
import { isNullorUndefined } from './type';

export function _tableVirtualScrollDirectiveStrategyFactory(tableDir: TableItemSizeDirective) {
  return tableDir.scrollStrategy;
}

const defaults = {
  rowHeight: 48,
  headerHeight: 56,
  headerEnabled: true,
  footerHeight: 48,
  footerEnabled: false,
  bufferMultiplier: 0.7
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'cdk-virtual-scroll-viewport[tvsItemSize]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: _tableVirtualScrollDirectiveStrategyFactory,
    deps: [forwardRef(() => TableItemSizeDirective)]
  }]
})
export class TableItemSizeDirective implements OnChanges, AfterContentInit, OnDestroy {
  private alive = true;

  // tslint:disable-next-line:no-input-rename
  @Input('tvsItemSize')
  rowHeight = defaults.rowHeight;

  @Input()
  headerEnabled = defaults.headerEnabled;

  @Input()
  headerHeight = defaults.headerHeight;

  @Input()
  footerEnabled = defaults.footerEnabled;

  @Input()
  footerHeight = defaults.footerHeight;

  @Input()
  bufferMultiplier = defaults.bufferMultiplier;

  @ContentChild(MatTable, { static: true }) table: MatTable<any>;

  @Output() requestRendering: EventEmitter<any> = new EventEmitter();

  scrollStrategy = new FixedSizeTableVirtualScrollStrategy();

  dataSourceChanges = new Subject<void>();

  constructor(private zone: NgZone) {
  }

  ngOnDestroy() {
    this.alive = false;
    this.dataSourceChanges.complete();
  }

  private isAlive() {
    return () => this.alive;
  }

  private isStickyEnabled(): boolean {
    return !!this.scrollStrategy.viewport && ((this.table as any)._headerRowDefs as CdkHeaderRowDef[])
      .map(def => def.sticky)
      .reduce((prevState, state) => prevState && state, true);
  }

  ngAfterContentInit() {
    const switchDataSourceOrigin = (this.table as any)._switchDataSource;
    (this.table as any)._switchDataSource = (dataSource: any) => {
      switchDataSourceOrigin.call(this.table, dataSource);
      this.connectDataSource(dataSource);
    };

    this.connectDataSource(this.table.dataSource);

    this.scrollStrategy.stickyChange
      .pipe(
        filter(() => this.isStickyEnabled()),
        takeWhile(this.isAlive())
      )
      .subscribe((stickyOffset) => {
        this.setSticky(stickyOffset);
      });
  }

  getPage(data, start, end): any[] {
    this.requestRendering.emit({from: start, to: end});
    return !(typeof start === 'number') || !(typeof end === 'number') ? data : data.slice(start, end);
  }

  connectDataSource(dataSource: any) {
      this.dataSourceChanges.next();
      if (dataSource instanceof TableVirtualScrollDataSource) {
        dataSource
          .dataToRender$
          .pipe(
            distinctUntilChanged(),
            takeUntil(this.dataSourceChanges),
            takeWhile(this.isAlive()),
            tap(data => this.scrollStrategy.dataLength = data.length),
            switchMap(data =>
              this.scrollStrategy
                .renderedRangeStream
                .pipe(
                  map(({ start, end }) => this.getPage(data, start, end))
                )
            )
          )
          .subscribe(data => {
            this.zone.run(() => {
              dataSource.dataOfRange$.next(data);
            });
          });
      } else {
        throw new Error('[tvsItemSize] requires TableVirtualScrollDataSource be set as [dataSource] of [mat-table]');
      }    
  }

  ngOnChanges() {
    const config = {
      rowHeight: +this.rowHeight || defaults.rowHeight,
      headerHeight: this.headerEnabled ? +this.headerHeight || defaults.headerHeight : 0,
      footerHeight: this.footerEnabled ? +this.footerHeight || defaults.footerHeight : 0,
      bufferMultiplier: +this.bufferMultiplier || defaults.bufferMultiplier
    };
    this.scrollStrategy.setConfig(config);
  }


  setSticky(offset) {
    // fixed bug when sticky true for header and one column. column scroll front of header. becuse of z-index
    let topOffset = -offset;
    this.scrollStrategy.viewport.elementRef.nativeElement.querySelectorAll('mat-header-row.mat-table-sticky')
      .forEach((el: HTMLElement) => {
        el.style.top = `${topOffset}px`;
        topOffset += el.offsetHeight;
        if (el.style.zIndex !== null ) {
          el.style.zIndex = '1000';
        }
      });
  }
}
