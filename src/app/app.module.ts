import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule, MatCheckboxModule, MatCardModule, MatExpansionModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
// import { DynamicMatTableModule } from 'dynamic-mat-table';
import { DynamicMatTableModule } from '../dynamic-mat-table/public-api';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
