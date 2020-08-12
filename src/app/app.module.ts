import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { DynamicMatTableModule } from 'dynamic-mat-table';
import { DynamicMatTableModule, TableIntl } from 'dynamic-mat-table';
import { PersionLanguage } from './persion.language';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

export function languageIntl() {  
  return new PersionLanguage();
}

@NgModule({
  declarations: [
    AppComponent
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
  ],
  providers: [
    { provide: TableIntl, useFactory: languageIntl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {  
}
