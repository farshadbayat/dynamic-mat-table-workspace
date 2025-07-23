import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[templateOrString]'
})
export class TemplateOrStringDirective {

  @Input() set templateOrString(content: string | TemplateRef<any>) {
    let template = content instanceof TemplateRef ? content : this.defaultTpl;
    this.vcr.clear();
    this.vcr.createEmbeddedView(template);
  }

  constructor(private defaultTpl: TemplateRef<any>, private vcr: ViewContainerRef) { }

}
