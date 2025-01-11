import { TrackInfoControlService } from './track-info-control.service';
import { saveAs } from 'file-saver';
import { Track } from '../../model/TrackMetaData.model';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { LayerService } from 'src/app/service/layer.service';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { Subscription } from 'rxjs';
import { POIService } from 'src/app/service/poi.service';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Input() public trackModel: Track;
  @Output() public onClose = new EventEmitter<boolean>();

  private resetTabOnTrackChange: Subscription;

  constructor(private _http: HttpClient, 
              private controls: TrackInfoControlService, 
              private layerService: LayerService,
              private POIservice: POIService) { }
  
  ngOnDestroy(): void {
    if(this.resetTabOnTrackChange) {
      this.resetTabOnTrackChange.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.resetTabOnTrackChange = this.layerService.selectedTrack.subscribe(res => {
      this.tabGroup.selectedIndex = 0;
    });
  }

  close(){
    this.onClose.emit(true);
    this.controls.closeTrackInfo.next(true);
  }

  downloadGPX(){
    this._http.get('/assets/gpx/' + this.trackModel.fileName + this.trackModel.fileType, {responseType: 'blob'}).toPromise()
      .then(res => {
        saveAs(res,this.trackModel.fileName + this.trackModel.fileType);
      })
  }
}
