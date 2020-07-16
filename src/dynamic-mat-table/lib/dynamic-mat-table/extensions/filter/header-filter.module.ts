import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatButtonModule,
} from '@angular/material';
import { HeaderFilterComponent } from './header-filter.component';
import { FilterEventDirective } from './filter-event.directive';


const components = [HeaderFilterComponent, FilterEventDirective];

@NgModule({
  declarations: components ,
  exports: components,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule
  ],
})
export class HeaderFilterModule {}
