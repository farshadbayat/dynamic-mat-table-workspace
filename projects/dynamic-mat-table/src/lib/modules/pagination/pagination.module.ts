import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from "./pagination.component";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from '@angular/material/tooltip';



@NgModule({
  declarations: [
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
  ],
    exports: [PaginationComponent]
})
export class PaginationModule {
}
