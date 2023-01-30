export class PageConfigModel {
  pageSize: number;
  length: number;
  pageIndex: number;

  previousPageIndex:number;

  pageSizeOptions:number[];

  dir: 'rtl' | 'ltr' = "ltr";

  nextLabel:string='Next';
  lastLabel:string='Go Last';
  previousLabel:string='Previous';
  firstLabel:string='Go first';


  constructor(totalElements: number, pageSize?: number, activePage?: number) {
    this.length = totalElements;
    this.pageSize = pageSize ? pageSize : 10;
    this.pageIndex = activePage ? activePage : 1;
    this.pageSizeOptions=[5,10,50,100];
    this.previousPageIndex=0;
  }
}
