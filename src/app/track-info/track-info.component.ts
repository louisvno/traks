import { TrackInfoControlService } from './track-info-control.service';
import { saveAs } from 'file-saver';
import { Track } from './../model/TrackMetaData.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit {

  constructor(private _http: HttpClient, private controls: TrackInfoControlService) { }

  @Input() public trackModel: Track;
  @Output() public onClose = new EventEmitter<boolean>();

  ngOnInit(): void {
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