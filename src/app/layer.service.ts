import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { withLatestFrom } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { Set } from 'immutable'
import { Track, TrackViewModel } from './model/TrackMetaData.model';
import * as L from 'leaflet';
import 'Leaflet.MultiOptionsPolyline'
import { RoadColors } from './model/RoadType.model';

@Injectable({
  providedIn: 'root',
})
//rename to UI service or sth
export class LayerService {
  
  public allLayers: Set<TrackViewModel> = Set();
  public markers: L.Marker[] = [];
  public trackSelected: Subject<TrackViewModel> = new Subject();
  private trkList: Subscription;

  constructor(private mapService: MapService, private trackService:TrackService) { 
      this.trkList = this.trackService.trackList.pipe(
        withLatestFrom(this.mapService.map)
      )
      .subscribe(
        ([trks, map])=> {
          trks.forEach(trk => {
            const viewModel = this.polyLineFromTrack(trk);
            if(!this.allLayers.has(viewModel)) this.allLayers.add(viewModel);
            this.addToMap(viewModel.mapFeature,map);
          })
        }
      )

      this.trackSelected.pipe(
        withLatestFrom(mapService.map)
      )
      .subscribe(([trk, map]) => {
        this.focusOnTrack(trk.mapFeature,map)
      })
  }

  public async focusOnTrack(l : L.MultiOptionsPolyline, map: L.Map){
    map.fitBounds(l.getBounds());
    const latLngs = l.getLatLngs();
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const startIcon = new L.Icon({iconUrl:'/assets/icons/Untitled-1.png', iconAnchor:[9,30]});
    const startMarker =new L.Marker(latLngs[0],{icon: startIcon});
    startMarker.addTo(map);
    this.markers.push(startMarker)

    const endIcon = new L.Icon({iconUrl:'/assets/icons/end-icon-sq.png', iconAnchor:[9,30]})
    const endMarker = new L.Marker(latLngs[latLngs.length -1],{icon: endIcon});
    endMarker.addTo(map);
    this.markers.push(endMarker)
    //show other track opacity 0.5?
    //
  }

  public async addToMap(l: L.MultiOptionsPolyline, map: L.Map){
    if(!map.hasLayer(l)) l.addTo(map);
  }

  public polyLineFromTrack(track: Track): TrackViewModel{
    // Render segments
    let polyline = L.multiOptionsPolyline(
      track.coordinates, 
        {multiOptions: {
          optionIdxFn: (latLng,_,index) => {
            return track.roadTypeArray[index];
          },
          options: [{color: RoadColors.GRAVEL}, {color: RoadColors.ASPHALT}, {color: RoadColors.COBBLE}]
        }});    
    
    polyline.on('click', (event: L.LeafletEvent) => {
      this.trackSelected.next({model: track , mapFeature: polyline});
    })
    return {model: track , mapFeature: polyline};
  }

}
