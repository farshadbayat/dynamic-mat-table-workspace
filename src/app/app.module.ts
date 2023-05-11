import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { PersianLanguage } from "./utilit/persian.language";
/* import { DynamicMatTableModule } from 'dynamic-mat-table'; */
import { DynamicMatTableModule, TableIntl } from "dynamic-mat-table";
import { DynamicCellComponent } from "./dynamic-cell/dynamic-cell.component";
import { MatSliderModule } from "@angular/material/slider";
import { OrderTableComponent } from "./order-table/order-table.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DynamicExpandCellComponent } from "./dynamic-expand-cell/dynamic-expand-cell.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatBadgeModule } from "@angular/material/badge";
import { TabComponentComponent } from "./tab-component/tab-component.component";
import { FullFeaturesDmtComponent } from "./full-features-dmt/full-features-dmt.component";
import { MatTabsModule } from "@angular/material/tabs";
import { FormlyCellComponent } from "./formly-cell/formly-cell.component";
import { FormlyMaterialModule } from "@ngx-formly/material";
import { FormlyModule } from "@ngx-formly/core";
import { TimePickerComponent } from "./formly-cell/time-picker/time-picker.component";
import { FlatpickrModule } from "angularx-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { UpperCasePipe } from "./utilit/upper-case.pipe";

export function languageIntl() {
  // return new TableIntl(); /* For EN */
  console.log(new PersianLanguage());
  return new PersianLanguage(); /* For FA */
}

@NgModule({
    declarations: [
        AppComponent,
        DynamicCellComponent,
        OrderTableComponent,
        DynamicExpandCellComponent,
        TabComponentComponent,
        FullFeaturesDmtComponent,
        FormlyCellComponent,
        TimePickerComponent,
        UpperCasePipe,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatExpansionModule,
        DynamicMatTableModule,
        MatSliderModule,
        DragDropModule,
        MatTableModule,
        MatIconModule,
        MatBadgeModule,
        MatTabsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        FlatpickrModule.forRoot(),
    ],
    providers: [{ provide: TableIntl, useFactory: languageIntl }],
    bootstrap: [AppComponent]
})
export class AppModule {}
