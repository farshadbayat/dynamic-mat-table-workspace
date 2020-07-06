import { Injectable } from '@angular/core';
import { LanguagePack } from '../models/language-pack.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { DefualtLanguage } from '../localize/defualt.language';
import { TableField } from '../models/table-field.model';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  get language(): Observable<LanguagePack> {
    return this.languagePack$.asObservable();
  }
  public languagePack$: BehaviorSubject<LanguagePack> = new BehaviorSubject<LanguagePack>(null);
  public tableName: string;

  constructor() {
    this.languagePack$.next(new DefualtLanguage());
  }

  /************************************* Local Export *****************************************/
  static getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
  }

  private downloadBlob(blob: Blob, filename: string) {
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  public exportToCsv( rows: object[], selectionModel: SelectionModel<any>, filename: string = '') {
    filename = filename === '' ? this.tableName + TableService.getFormattedTime() + '.csv' : filename;
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys =  Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  public exportToJson( rows: object[], filename: string = '') {
    filename = filename === '' ? this.tableName + TableService.getFormattedTime() + '.json' : filename;
    const blob = new Blob([ JSON.stringify(rows) ], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  /********************************************* Language Text *********************************************/
  public loadLanguagePack(language: LanguagePack) {
    this.languagePack$.next(language);
  }

  /************************************* Save Setting into storage *****************************************/
  public loadSavedColumnInfo(columnInfo: TableField<any>[], saveName?: string): TableField<any>[] {
    // Only load if a save name is passed in
    if (saveName) {
      if (!localStorage) {
        return;
      }

      const loadedInfo = localStorage.getItem(`${saveName}-columns`);

      if (loadedInfo) {
        return JSON.parse(loadedInfo);
      }
      this.saveColumnInfo(columnInfo);
      return columnInfo;
    }
  }

  public saveColumnInfo(columnInfo: TableField<any>[], saveName: string = this.tableName): void {
    console.log(saveName);
    if (saveName) {
      if (!localStorage) {
        return;
      }

      localStorage.setItem(`${saveName}-columns`, JSON.stringify(columnInfo));
    }
  }

}
