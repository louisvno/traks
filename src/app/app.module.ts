import { LayerService } from './layer.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapDirective } from './map.directive';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button'; 
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs'; 
import {LineChartModule } from '@swimlane/ngx-charts';
import {MatDividerModule} from '@angular/material/divider'; 
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { BottomSheetContentComponent } from './bottom-sheet-content/bottom-sheet-content.component';
import { AngularResizedEventModule } from 'angular-resize-event';


@NgModule({
  declarations: [
    AppComponent,
    MapDirective,
    BottomSheetContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    LineChartModule,
    MatListModule,
    MatDividerModule,
    MatBottomSheetModule,
    AngularResizedEventModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
