import { MatTableModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatIconModule,
  MatProgressBarModule,
  MatPaginatorModule} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableVirtualScrollModule } from '../cores/table-virtual-scroll.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableMenuModule } from './extensions/menu/table-menu.module';
import { HeaderFilterModule } from './extensions/filter/header-filter.module';
import { DynamicMatTableComponent } from './dynamic-mat-table.component';

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
    HeaderFilterModule
  ],
  exports: [ DynamicMatTableComponent],
  declarations: [DynamicMatTableComponent]
})
export class DynamicMatTableModule { }
