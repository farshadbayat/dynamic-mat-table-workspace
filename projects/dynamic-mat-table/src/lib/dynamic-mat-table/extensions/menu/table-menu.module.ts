import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatCheckboxModule,
} from '@angular/material';
import { TableMenuComponent } from './table-menu.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

const components = [TableMenuComponent];

@NgModule({
  declarations: [components],
  exports: components,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule, MatIconModule, DragDropModule, MatMenuModule],
})
export class TableMenuModule {}
