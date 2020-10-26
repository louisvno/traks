import { BottomSheetService } from './bottom-sheet-content/bottom-sheet.service';
import { HttpClient } from '@angular/common/http';
import { LayerService } from './layer.service';
import { TrackService } from './track.service';
import { Component, OnInit } from '@angular/core';
import { pluck, tap, filter } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetContentComponent } from './bottom-sheet-content/bottom-sheet-content.component';
import { Track } from './model/TrackMetaData.model';

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
  public isSheetOpen = false;
  private _lastTrackSelected: Track;
  // when sheet is open, apply distinct until changed
  // when sheet is closed dont apply distinct until changed
  public trkModel = this.layer.trackSelected.pipe(
    pluck('model'),
    filter(trk =>{
      if(this.isSheetOpen){
       return this._lastTrackSelected.fileName !== trk.fileName;
      } else {
        return true;
      }}
    ),
    tap(trk => this._lastTrackSelected = trk)
  );

  constructor(private trackService: TrackService, private layer: LayerService, 
    private http: HttpClient, private _bottomSheet: MatBottomSheet,
    private sheetService: BottomSheetService){

  }
  ngOnInit(): void {
    // if new track model is received and already sheetIsOpen, do not execute afterDismissed
    // if no new track model is recieved, do execute
    this.trkModel.subscribe(model =>{
      this._bottomSheet
        .open(BottomSheetContentComponent, {data: model, hasBackdrop: false});
      this.isSheetOpen = true;
    })

    this.sheetService.closeBtn.subscribe(_=> this.isSheetOpen=false);
  }

  openBottomSheet (){
    this._bottomSheet.open(BottomSheetContentComponent);
  }

  onResized(){
    //this.layer.mapResized.next(true)
  }
}
