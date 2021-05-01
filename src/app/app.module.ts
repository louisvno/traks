import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapDirective } from './service/map.directive';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button'; 
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs'; 
import {LineChartModule } from '@swimlane/ngx-charts';
import {MatDividerModule} from '@angular/material/divider'; 
import { AngularResizedEventModule } from 'angular-resize-event';
import { TrackInfoComponent } from './component/track-info/track-info.component';
import { VideoComponent } from './component/video/video.component';
import { NoVideoComponent } from './component/no-video/no-video.component';


@NgModule({
  declarations: [
    AppComponent,
    MapDirective,
    TrackInfoComponent,
    VideoComponent,
    NoVideoComponent,
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
    AngularResizedEventModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
