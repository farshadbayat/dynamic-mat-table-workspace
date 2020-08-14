import { NgModule } from '@angular/core';
import { TableMenuComponent } from './table-menu.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

const components = [TableMenuComponent];

@NgModule({
  declarations: [components],
  exports: components,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatIconModule, DragDropModule, MatMenuModule, MatRadioModule],
})
export class TableMenuModule {}
