import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  TemplateRef
} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipComponent} from './tooltip.component';

@Directive({
  selector: '[tooltip]:not([click-to-open])'
})
export class TooltipDirective implements OnDestroy {
  @Input('tooltip') content: string | TemplateRef<any> | undefined;
  private overlayRef: OverlayRef | undefined;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef
  ) {
  }

  ngOnDestroy(): void {
    this.hide();
  }

  ngOnInit() {

    const positionStrategy = this.overlayPositionBuilder.flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      }]);


    this.overlayRef = this.overlay.create({positionStrategy});
  }

  @HostListener('mouseenter')
  show() {
    const injector = Injector.create({
      providers: [{provide: 'tooltipConfig', useValue: this.content}]
    });
    const tooltipRef: ComponentRef<TooltipComponent> = this.overlayRef!.attach(new ComponentPortal(TooltipComponent, null, injector));
    // tooltipRef.onDestroy((x) => {});
  }


  @HostListener('mouseleave')
  hide() {
    this.overlayRef!.detach();
  }

}


