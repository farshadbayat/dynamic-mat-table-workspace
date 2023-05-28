import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PageConfigModel} from './page-config.model';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Output('page') pageChange: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  id = new Date().getTime();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pageIndex) {
      this.pageIndex = changes.pageIndex.currentValue + 1;
    }
    if (changes.pageSizeOptions && !changes.pageSizeOptions.currentValue.includes(this.pageSize) && changes.pageSizeOptions.currentValue.length > 0) {
      this.pageSize = changes.pageSizeOptions.currentValue[0];
    }
    if (changes.pageIndex && this.pageCount < changes.pageIndex.currentValue) {
      this.pageIndex = this.pageCount;
    }
  }


  @Input() pageIndex: number = 1;
  @Input() previousPageIndex: number | null = null;
  @Input() dir: 'rtl' | 'ltr' = 'rtl';
  @Input() pageSize = 10;
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() firstLabel = 'Go first';
  @Input() lastLabel = 'Go Last';
  @Input() length = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 50, 100];


  get pageCount() {
    if (this.pageSize === 0) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }

  ngOnInit(): void {
  }

  goFirst() {
    this.pageIndex = 1;
    this.emit();
  }

  goLast() {
    this.pageIndex = this.pageCount;
    this.emit();
  }

  next() {
    if (this.pageIndex! < this.pageCount) {
      this.pageIndex!++;
      this.emit();
    }
  }

  previous() {
    if (this.pageIndex! > 1) {
      this.pageIndex!--;
      this.emit();
    }
  }

  goToPage(event: any) {
    if (event.target.value > 0 && event.target.value <= this.pageCount) {
      this.pageIndex = event.target.value;
    } else if (event.target.value > this.pageCount) {
      this.pageIndex = this.pageCount;
    } else if (event.target.value < 1) {
      this.pageIndex = 1;
    }
    this.emit();
  }

  reset(event: any) {
    this.pageIndex = 1;
    this.emit();
  }


  emit() {
    const data: PageEvent = new PageEvent();
    data.pageIndex = (+this.pageIndex) - 1;
    data.length = +this.length;
    data.pageSize = +this.pageSize;
    data.previousPageIndex = +this.previousPageIndex;
    this.pageChange.emit(data);
  }
}
