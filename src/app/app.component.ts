import { HttpClient } from '@angular/common/http';
import { LayerService } from './layer.service';
import { TrackService } from './track.service';
import { Component, OnInit } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetContentComponent } from './bottom-sheet-content/bottom-sheet-content.component';

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
  public trkModel = this.layer.trackSelected.pipe(pluck('model'));

  constructor(private trackService: TrackService, private layer: LayerService, private http: HttpClient, private _bottomSheet: MatBottomSheet){

  }
  ngOnInit(): void {
    this.trkModel.subscribe(model =>{
      this._bottomSheet.open(BottomSheetContentComponent, {data: model, hasBackdrop: false})
    })
  }

  openBottomSheet (){
    this._bottomSheet.open(BottomSheetContentComponent);
  }
}
