import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() itemList: ToolbarItem[] = [];
  @Input() color: string = null;
  @Input() direction: 'ltr' | 'rtl' = 'ltr';
  @Output() actionClick = new EventEmitter<ToolbarItem>();

  @HostListener('document:keyup', ['$event'])
  onKeyup(e: KeyboardEvent) {    
  }

  normalItemList: ToolbarItem[] = [];
  floatItemList: ToolbarItem[] = [];

  constructor(public _el:ElementRef) {    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.itemList && this.itemList) {
      this.normalItemList = this.itemList.filter( item => item.float === undefined || item.float == false);
      this.floatItemList = this.itemList.filter( item => item?.float == true);
    }
  }

  ngOnInit() {}

  item_onClick(item: ToolbarItem) {
    this.actionClick.emit(item);
  }
}

export interface ToolbarItem {
  id: number;
  name?: string;
  tooltip?: string;
  matIcon?: string;
  matIconColor?: string;
  svgIcon?: string;
  splitter?: boolean;
  disable?: boolean;
  float?: boolean;
}


