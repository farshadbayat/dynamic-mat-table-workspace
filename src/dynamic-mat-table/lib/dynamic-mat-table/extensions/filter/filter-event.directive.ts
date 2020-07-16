import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[filter-event]'
})
export class FilterEventDirective {
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    return false;
  }
}
