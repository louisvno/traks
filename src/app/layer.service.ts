import { TrackInfoControlService } from './track-info/track-info-control.service';
import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { withLatestFrom, delay } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { Set } from 'immutable'
import { Track, TrackViewModel } from './model/TrackMetaData.model';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
//rename to UI service or sth
export class LayerService {
  
  public allLayers: Set<TrackViewModel> = Set();
  public markers: L.Marker[] = [];
  public trackSelected: Subject<TrackViewModel> = new Subject();
  private trkList: Subscription;
  public unfocusEvent = new Subject<boolean>();

  constructor(private mapService: MapService, private trackService:TrackService, private trackControls: TrackInfoControlService) { 
      this.trkList = this.trackService.trackList.pipe(
        withLatestFrom(this.mapService.map)
      )
      .subscribe(
        ([trks, map])=> {
          trks.forEach(trk => {
            const viewModel = this.polyLineFromTrack(trk);
            if(!this.allLayers.has(viewModel)) this.allLayers.add(viewModel);
            this.addToMap(viewModel.mapFeature,map);
            this.addToMap(viewModel.touchHelper,map);
          })
        }
      )

      this.trackSelected.pipe(
        withLatestFrom(mapService.map),
        delay(100)
      )
      .subscribe(([trk, map]) => {
        this.focusOnTrack(trk.mapFeature,map)
      })

      this.trackControls.closeTrackInfo.pipe(
        withLatestFrom(mapService.map),
        delay(100)
      )
      .subscribe(([_,map]) => {
        this.unFocusTrack(map)
      })
  }

  public async focusOnTrack(l : L.Polyline, map: L.Map){
    map.invalidateSize();
    map.fitBounds(l.getBounds());
    const latLngs = l.getLatLngs() as L.LatLng[];
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const startIcon = new L.Icon({iconUrl:'/assets/icons/Untitled-1.png', iconAnchor:[9,30]});
    const startMarker =new L.Marker(new L.LatLng(latLngs[0].lat, latLngs[0].lng),{icon: startIcon});
    startMarker.addTo(map);
    this.markers.push(startMarker)

    const endIcon = new L.Icon({iconUrl:'/assets/icons/end-icon-sq.png', iconAnchor:[9,30]})
    const endMarker = new L.Marker(latLngs[latLngs.length -1],{icon: endIcon});
    endMarker.addTo(map);
    this.markers.push(endMarker)
    //show other track opacity 0.5?
    //
  }

  public unFocusTrack(map: L.Map){
    map.invalidateSize();
    this.markers.forEach(m => m.remove());
    this.unfocusEvent.next(true);
  }

  public async addToMap(l: L.Layer, map: L.Map){
    if(!map.hasLayer(l)) l.addTo(map);
  }

  public polyLineFromTrack(track: Track): TrackViewModel{
    // Render segments
    let polylineHelper = L.polyline( track.coordinates, {weight: 20, opacity:0 });
    let polyline = L.polyline(track.coordinates,{color: track.color})    

    polylineHelper.on('click', (event: L.LeafletEvent) => {
      this.trackSelected.next({model: track , mapFeature: polyline, touchHelper: polylineHelper});
    })
    
    return {model: track , mapFeature: polyline,touchHelper: polylineHelper};
  }

}
