import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from "./pagination.component";
import {FormsModule} from "@angular/forms";
import {TooltipModule} from "../tooltip/tooltip.module";


@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule
  ],
  exports: [PaginationComponent]
})
export class PaginationModule {
}
