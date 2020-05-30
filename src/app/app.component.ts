import { Subscription } from 'rxjs';
import { LayerService } from './layer.service';
import { TrackService } from './track.service';
import { Component } from '@angular/core';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'traks';
  public trkModel = this.layer.trackSelected.pipe(pluck('model'));

  constructor(private trackService: TrackService, private layer: LayerService){
  }
}
