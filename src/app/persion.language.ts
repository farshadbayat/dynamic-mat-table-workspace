import { MatPaginatorIntl } from '@angular/material/paginator';
import { FilterLabels, LanguagePack, MenuLabels, TableLabels } from 'dynamic-mat-table';
export class PersionLanguage implements LanguagePack {

  constructor() {
    console.log('international');
  }

  menuLabels: MenuLabels = {
    saveData: 'ذخیره داده ها ',
    columnSetting: 'تنظیمات ستون ها ',
    saveTableSetting: 'ذخیره  تنظیمات جدول',
    clearFilter: 'فیلتر را پاک کنید',
    jsonFile: 'Json فایل',
    csvFile: 'CSV فایل',
    printTable: 'چاپ جدول',
    filterMode: 'نوع فیلتر',
    filterLocalMode: 'محلی',
    filterServerMode: 'سرور',
    sortMode: 'حالت مرتب سازی',
    sortLocalMode: 'سمت کاربر',
    sortServerMode: 'سمت سرور',
    printMode: 'حالت چاپ',
    printYesMode: 'بله',
    printNoMode: 'خیر',
    pinMode: 'حالت پین ',
    pinNoneMode: 'هیچ کدام',
    pinStartMode: 'شروع',
    pinEndMode: 'پایان',
  };

  paginatorLabels: MatPaginatorIntl = {
    changes: null,
    itemsPerPageLabel: 'ایتم های هر صفحه:',
    nextPageLabel: 'صفحه بعدی:',
    previousPageLabel: 'صفحه قبلی:',
    firstPageLabel: 'اولین صفحه:',
    lastPageLabel: 'آخرین صفحه:',
    getRangeLabel : (page: number, pageSize: number, length: number) => {
      console.log(page, pageSize, length);
      if (length === 0 || pageSize === 0) { return `0 از ${length}`; }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} از ${length}`;
    }
  };

  tableLabels: TableLabels =
  {
    NoData: 'هیچ رکوردی پیدا نشد'
  };

  filterLabels: FilterLabels = {
    Clear: 'پاک کردن',
    Search: 'جستجو',
    And: 'و',
    Or: 'یا',
    /* Text Compare */
    Text: 'متن',
    TextContains: 'دربرگرفتن',
    TextEmpty: 'خالی بودن',
    TextStartsWith: 'شروع شدن با',
    TextEndsWith: ' پایان گرفتن با',
    TextEquals: 'مساوی بودن',
    TextNotEmpty: 'خالی نبودن',
    /* Number Compare */
    Number: 'تعداد',
    NumberEquals: 'مساوی',
    NumberNotEquals: 'مساوی نبودن',
    NumberGreaterThan: ' بزرگ تر از',
    NumberLessThan: 'کم تر از ',
    NumberEmpty: 'خالی بودن',
    NumberNotEmpty: 'خالی نبودن',
    /* Category List Compare */
    CategoryContains: 'در برگرفتن',
    CategoryNotContains: 'در بر نگرفتن',
    /* Boolean Compare */

    /* Date Compare */

  };

}




