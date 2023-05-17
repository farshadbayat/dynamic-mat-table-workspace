export class PageConfigModel {
  pageSize: number = 10;
  length: number = 0;
  pageIndex: number = 1;

  previousPageIndex?: number | null = null;

  pageSizeOptions: number[] = [5, 10, 50, 100];

  dir: 'rtl' | 'ltr' = "ltr";

  nextLabel: string = 'Next';
  lastLabel: string = 'Go Last';
  previousLabel: string = 'Previous';
  firstLabel: string = 'Go first';

  constructor() {
  }
}
