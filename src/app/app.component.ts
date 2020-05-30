import { LayerService } from './layer.service';
import { TrackService } from './track.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'traks';
  constructor(private trackService: TrackService, private layer: LayerService){}
}
