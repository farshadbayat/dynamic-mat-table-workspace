import {animate, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component, HostBinding, Inject, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({opacity: 0}),
        animate(300, style({opacity: 1})),
      ]),
      transition(':leave', [
        animate(300, style({opacity: 0})),
      ])
    ])
  ]
})
export class TooltipComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'cell-tooltip';

  constructor(@Inject('tooltipConfig') public content: any) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
