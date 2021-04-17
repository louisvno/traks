import { HttpClient } from '@angular/common/http';
import { LayerService } from './service/layer.service';
import { TrackService } from './service/track.service';
import { Component, OnInit } from '@angular/core';
import { pluck, tap, filter } from 'rxjs/operators';
import { Track } from './model/TrackMetaData.model';
import { MarkerManagerService } from './service/markerManager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'traks';
  public view = [700,300];
  public colorScheme = {
    domain: ['#5AA454']
  };
  //evaluate these state variables
  public showTrackInfo = false;
  private _lastTrackSelected: Track;
  // when sheet is open, apply distinct until changed
  // when sheet is closed dont apply distinct until changed
  public trkModel = this.layer.trackSelected.pipe(
    pluck('model'),
    filter(trk =>{
      if(this.showTrackInfo){
       return this._lastTrackSelected.fileName !== trk.fileName;
      } else {
        return true;
      }}
    ),
    tap(trk => {
      this._lastTrackSelected = trk;
      this.showTrackInfo = true;
    })
  );

  constructor(
    private trackService: TrackService, 
    private layer: LayerService, 
    private http: HttpClient, 
    private markerManager: MarkerManagerService ){

  }
  ngOnInit(): void {
    // if new track model is received and already sheetIsOpen, do not execute afterDismissed
    // if no new track model is recieved, do execute
  }

  closeTrackInfo(){
    this.showTrackInfo = false;
  }
}
