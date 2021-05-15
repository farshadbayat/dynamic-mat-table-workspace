import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PersianLanguage } from './persian.language';
/* import { DynamicMatTableModule } from 'dynamic-mat-table'; */
import { DynamicMatTableModule, TableIntl } from 'dynamic-mat-table';
import { DynamicCellComponent } from './dynamic-cell/dynamic-cell.component';
import {MatSliderModule} from '@angular/material/slider';
import { OrderTableComponent } from './order-table/order-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicExpandCellComponent } from './dynamic-expand-cell/dynamic-expand-cell.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { TabComponentComponent } from './tab-component/tab-component.component';
import { FullFeaturesDmtComponent } from './full-features-dmt/full-features-dmt.component';
import {MatTabsModule} from '@angular/material/tabs';

export function languageIntl() {
  // return new TableIntl(); /* For EN */
  return new PersianLanguage(); /* For FA */
}

@NgModule({
  declarations: [				
    AppComponent,
    DynamicCellComponent,
    OrderTableComponent,
    DynamicExpandCellComponent,
      TabComponentComponent,
      FullFeaturesDmtComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    DynamicMatTableModule,
    MatSliderModule,
    DragDropModule,
    MatTableModule,
    MatIconModule,
    MatBadgeModule,
    MatTabsModule
  ],
  entryComponents:[
    DynamicCellComponent,
    DynamicExpandCellComponent
  ],
  providers: [
    { provide: TableIntl, useFactory: languageIntl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
