import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapDirective } from './service/map.directive';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button'; 
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs'; 
import {LineChartModule } from '@swimlane/ngx-charts';
import {MatDividerModule} from '@angular/material/divider'; 
import { TrackInfoComponent } from './component/track-info/track-info.component';
import { VideoComponent } from './component/video/video.component';
import { NoVideoComponent } from './component/no-video/no-video.component';
import { PoiImageComponent } from './component/poi-image/poi-image.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';


@NgModule({
  declarations: [
    AppComponent,
    MapDirective,
    TrackInfoComponent,
    VideoComponent,
    NoVideoComponent,
    PoiImageComponent,
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
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
