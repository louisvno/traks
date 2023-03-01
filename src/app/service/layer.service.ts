import { TrackInfoControlService } from '../component/track-info/track-info-control.service';
import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { withLatestFrom, delay } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { Set } from 'immutable'
import { Track, TrackViewModel } from '../model/TrackMetaData.model';
import * as L from 'leaflet';
import { Router} from '@angular/router';
import { MarkerService } from './marker.service';
import { POIService } from './poi.service';

@Injectable({
  providedIn: 'root',
})
//rename to UI service or sth
export class LayerService {
  
  public allLayers: Set<TrackViewModel> = Set();
  public selectedTrack: ReplaySubject<TrackViewModel | undefined> = new ReplaySubject(1);
  public unfocusEvent = new Subject<boolean>();
  public mapAndTracksLoaded = new Subject<boolean>();

  constructor(
    private mapService: MapService,
    private trackService:TrackService,
    private trackControls: TrackInfoControlService,
    private router : Router,
    private trackMarkerService: MarkerService,
    private POIService: POIService
  ) { 
      this.selectedTrack.next(undefined);
      this.trackService.trackList.pipe(
        withLatestFrom(this.mapService.map)
      )
      .subscribe(
        ([trks, map])=> {
          trks.forEach(trk =>  this.addTrack(trk, map));
          this.mapAndTracksLoaded.next(true);
        }
      )

      this.selectedTrack.pipe(
        withLatestFrom(mapService.map),
        delay(100) // delay needed to wait for resize transform.
      )
      .subscribe(([trk, map]) => {
        if(trk) this.focusOnTrack(trk ,map);
      })

      this.trackControls.closeTrackInfo.pipe(
        withLatestFrom(mapService.map),
        delay(100) // delay needed to wait for resize transform.
      )
      .subscribe(([_,map]) => {
        this.unFocusTrack(map)
      })
  }

  private addTrack(trk: Track, map: L.Map) {
  
    const trackViewModel = this.polyLineFromTrack(trk);
  
    if (!this.allLayers.has(trackViewModel)){
      this.allLayers = this.allLayers.add(trackViewModel);
    }

    this.addToMap(trackViewModel.mapFeature, map);
    this.addToMap(trackViewModel.touchHelper, map);
  }

  private focusOnTrack(trk : TrackViewModel, map: L.Map){

    const l = trk.mapFeature;

    map.invalidateSize();
    map.fitBounds(l.getBounds(),{padding:[0,20]});
    
    this.trackMarkerService.initMarkers(map, l);
    this.POIService.initPOIsforTrack(map, trk.model);
  }

  private unFocusTrack(map: L.Map){

    map.invalidateSize();
  
    this.trackMarkerService.clearMarkers();
    this.POIService.clearPOIs();
  
    this.unfocusEvent.next(true);
    this.selectedTrack.next(undefined);
  
    this.router.navigate(['/'])
  }

  private addToMap(l: L.Layer, map: L.Map){

    if(!map.hasLayer(l)) l.addTo(map);
  }

  private polyLineFromTrack(track: Track): TrackViewModel{

    let polylineHelper = L.polyline( track.coordinates, {weight: 20, opacity:0 });
    let polyline = L.polyline(track.coordinates,{color: track.color})    

    polylineHelper.on('click', (event: L.LeafletEvent) => {
      this.router.navigate([track.fileName]);
      //this.selectedTrack.next({model: track , mapFeature: polyline, touchHelper: polylineHelper});
    })  
    return {model: track , mapFeature: polyline,touchHelper: polylineHelper};
  }

}
