import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatCheckboxModule,
  MatRadioModule,
} from '@angular/material';
import { TableMenuComponent } from './table-menu.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const components = [TableMenuComponent];

@NgModule({
  declarations: [components],
  exports: components,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, DragDropModule, MatMenuModule, MatRadioModule],
})
export class TableMenuModule {}
