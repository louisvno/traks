import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { LatLng, map } from 'leaflet';
import { take, withLatestFrom } from 'rxjs/operators';
import { Subscription, combineLatest } from 'rxjs';
import { Set } from 'immutable'

@Injectable({
  providedIn: 'root',
})
//rename to UI service or sth
export class LayerService {
  
  public allLayers: Set<L.MultiOptionsPolyline> = Set();
  private trkList: Subscription;

  constructor(private mapService: MapService, private trackService:TrackService) { 
      this.trkList = this.trackService.trackList.pipe(
        withLatestFrom(mapService.map)
      )
      .subscribe(
        ([trks, map])=> {
          trks.forEach(trk => {
            if(!this.allLayers.has(trk)) this.allLayers.add(trk);
            this.addToMap(trk,map);
          })
        }
      )

      this.trackService.trackSelected.pipe(
        withLatestFrom(mapService.map)
      )
      .subscribe(([trk, map]) => {
        this.focusOnTrack(trk,map)
      })
  }

  public async focusOnTrack(l : L.MultiOptionsPolyline, map: L.Map){
    map.fitBounds(l.getBounds())
    //show start and finish
    //show other track opacity 0.5?
    //
  }

  public async addToMap(l: L.MultiOptionsPolyline, map: L.Map){
    if(!map.hasLayer(l)) l.addTo(map);
  }
}
