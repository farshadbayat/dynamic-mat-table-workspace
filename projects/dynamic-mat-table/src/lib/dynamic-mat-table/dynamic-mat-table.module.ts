import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableVirtualScrollModule } from '../cores/table-virtual-scroll.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableMenuModule } from './extensions/menu/table-menu.module';
import { HeaderFilterModule } from './extensions/filter/header-filter.module';
import { DynamicMatTableComponent } from './dynamic-mat-table.component';
import { PrintTableDialogComponent } from './extensions/print-dialog/print-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TableIntl } from '../international/table-Intl';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

export function paginatorLabels(tableIntl: TableIntl) {
  console.log('sss');
  console.log(tableIntl);
  // return new TableIntl().paginatorLabels;
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'آیتم در هر صفحه:';
  paginatorIntl.nextPageLabel = 'صفحه بعد';
  paginatorIntl.previousPageLabel = 'صفحه قبل';
  // paginatorIntl.getRangeLabel = dutchRangeLabel;

  return tableIntl.paginatorLabels || null;
}

export class PaginatorIntl  {
  itemsPerPageLabel = 'Items per page:';
  nextPageLabel = 'Next Page:';
  previousPageLabel = 'Previous Page:';
  firstPageLabel = 'First Page:';
  lastPageLabel = 'Last Page:';
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 of ${length}`; }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  }

  constructor() {
    // super();
    console.log('dd');
  }
}


// const extentionsModule = [HeaderFilterModule];
@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    DragDropModule,
    TableMenuModule,
    MatPaginatorModule,
    HeaderFilterModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [ DynamicMatTableComponent],
  providers: [
    // { provide: TableIntl, useClass: TableIntl} ,
    { provide: MatPaginatorIntl, useFactory: paginatorLabels, deps: [TableIntl] }
  ],
  declarations: [ DynamicMatTableComponent, PrintTableDialogComponent ],
  entryComponents: [ PrintTableDialogComponent ]
})
export class DynamicMatTableModule { }


