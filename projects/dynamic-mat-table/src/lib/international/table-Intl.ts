import { LanguagePack, TableLabels, FilterLabels, MenuLabels } from '../models/language-pack.model';
import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TableIntl implements LanguagePack {
  menuLabels: MenuLabels = {
    saveData: 'Save Data',
    columnSetting: 'Column Setting',
    saveTableSetting: 'Save Table Setting',
    clearFilter: 'Clear Filter',
    jsonFile: 'Json File',
    csvFile: 'CSV File',
    printTable: 'Print Table',
    filterMode: 'Filter Mode',
    filterLocalMode: 'Local',
    filterServerMode: 'Server',
    sortMode: 'Sort Mode',
    sortLocalMode: 'Local',
    sortServerMode: 'Server',
    printMode: 'Print Mode',
    printYesMode: 'Yes',
    printNoMode: 'No',
    pinMode: 'Pin Mode',
    pinNoneMode: 'None',
    pinStartMode: 'Start',
    pinEndMode: 'End',
  };

  paginatorLabels: MatPaginatorIntl = {
    changes:  new Subject<void>(),
    itemsPerPageLabel: 'Items per page:',
    nextPageLabel: 'Next Page:',
    previousPageLabel: 'Previous Page:',
    firstPageLabel: 'First Page:',
    lastPageLabel: 'Last Page:',
    getRangeLabel : (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) { return `0 of ${length}`; }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} of ${length}`;
    }
  };

  tableLabels: TableLabels =
  {
    NoData: 'No records found.'
  };

  filterLabels: FilterLabels = {
    Clear: 'Clear',
    Search: 'Search',
    And: 'And',
    Or: 'Or',
    /* Text Compare */
    Text: 'Text',
    TextContains: 'Contains',
    TextEmpty: 'Empty',
    TextStartsWith: 'Starts With',
    TextEndsWith: 'Ends With',
    TextEquals: 'Equals',
    TextNotEmpty: 'Not Empty',
    /* Number Compare */
    Number: 'Number',
    NumberEquals: 'Equals',
    NumberNotEquals: 'Not Equals',
    NumberGreaterThan: 'Greater Than',
    NumberLessThan: 'Less Than',
    NumberEmpty: 'Empty',
    NumberNotEmpty: 'Not Empty',
    /* Category List Compare */
    CategoryContains: 'Contains',
    CategoryNotContains: 'Not Contains',
    /* Boolean Compare */
    /* Date Compare */
  };

}




