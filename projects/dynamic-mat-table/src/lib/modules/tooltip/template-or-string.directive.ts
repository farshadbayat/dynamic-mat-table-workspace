import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[templateOrString]'
})
export class TemplateOrStringDirective {

  constructor(private defaultTpl: TemplateRef<any>, private vcr: ViewContainerRef) {
  }

  @Input() set templateOrString(content: string | TemplateRef<any>) {
    let template = content instanceof TemplateRef ? content : this.defaultTpl;
    this.vcr.clear();
    this.vcr.createEmbeddedView(template);
  }

}
