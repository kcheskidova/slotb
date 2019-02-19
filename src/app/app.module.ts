import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSlideToggleModule } from '@angular/material';
import {FlexModule} from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { ReelComponent } from './reel/reel.component';
import { CherryComponent } from './cherry/cherry.component';


@NgModule({
  declarations: [
    AppComponent,
    ReelComponent,
    CherryComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule, MatInputModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FlexModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
