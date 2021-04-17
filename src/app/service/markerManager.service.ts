import { Injectable } from "@angular/core";
import * as L from "leaflet";
import { withLatestFrom } from "rxjs/operators";
import { TrackViewModel } from "../model/TrackMetaData.model";
import { LayerService } from "./layer.service";
import { MarkerService } from "./marker.service";
import { VideoService } from "./video.service";

@Injectable({
  providedIn: 'root',
})

export class MarkerManagerService {
  
  constructor(private videoService: VideoService, private markerService: MarkerService, private layerService: LayerService) {
    
    this.subscribeToVideoEvents(videoService);
  }
  
  private subscribeToVideoEvents(videoService: VideoService) {
    
    videoService.playerDestroy$
    .pipe(withLatestFrom(this.layerService.trackSelected))
    .subscribe(([_, trk]) => {
      this.markerService.resetStartMarkerPosition(trk);
    });
    
    this.videoService.observePlayerTime()
    .pipe(
      withLatestFrom(this.layerService.trackSelected)
      )
      .subscribe(([time, trk]) => {
        
        const coord = this.videoService.getCoordsByTime(time.seconds, trk.model.timeCoordinates);
        this.markerService.updateStartMarkerPosition(coord.lat, coord.lng);
      });
    }
  }