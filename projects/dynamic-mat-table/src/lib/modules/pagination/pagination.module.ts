import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginationComponent} from "./pagination.component";
import {FormsModule} from "@angular/forms";
import {TooltipDirective} from '../tooltip/tooltip.directive';
import {TooltipComponent} from '../tooltip/tooltip.component';
import {TemplateOrStringDirective} from '../tooltip/template-or-string.directive';



@NgModule({
  declarations: [
    PaginationComponent,
    TooltipDirective,
    TooltipComponent,
    TemplateOrStringDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
    exports: [PaginationComponent]
})
export class PaginationModule {
}
