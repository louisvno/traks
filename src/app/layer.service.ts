import { TrackInfoControlService } from './track-info/track-info-control.service';
import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { withLatestFrom, delay, filter } from 'rxjs/operators';
import { Subscription, Subject, Observable, combineLatest, zip } from 'rxjs';
import { Set } from 'immutable'
import { Track, TrackViewModel } from './model/TrackMetaData.model';
import * as L from 'leaflet';
import { RouterEvent, NavigationEnd, Router} from '@angular/router';

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
  public mapAndTracksLoaded = new Subject<boolean>();
  private navigationEnd: Observable<RouterEvent>;

  constructor(
    private mapService: MapService,
    private trackService:TrackService,
    private trackControls: TrackInfoControlService,
    private router : Router
  ) { 
      this.trkList = this.trackService.trackList.pipe(
        withLatestFrom(this.mapService.map)
      )
      .subscribe(
        ([trks, map])=> {
          trks.forEach(trk =>  this.addTrack(trk, map));
          this.mapAndTracksLoaded.next(true);
        }
      )

      this.trackSelected.pipe(
        withLatestFrom(mapService.map),
        delay(100) // delay needed to wait for resize transform.
      )
      .subscribe(([trk, map]) => {
        this.focusOnTrack(trk.mapFeature,map)
      })

      this.trackControls.closeTrackInfo.pipe(
        withLatestFrom(mapService.map),
        delay(100) // delay needed to wait for resize transform.
      )
      .subscribe(([_,map]) => {
        this.unFocusTrack(map)
      })
      
      this.navigationEnd = this.router.events.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd));

      combineLatest(this.navigationEnd, this.mapAndTracksLoaded)
      .subscribe((([event, _]: [RouterEvent, boolean]) => {
        console.log(event.url.slice(1));
        console.log(_)
        console.log(this.allLayers)
        const track = this.allLayers.find(
                              vm => { 
                                return vm.model.fileName === event.url.slice(1)
                              })
        this.trackSelected.next(track);
        }))
  }

  private addTrack(trk: Track, map: L.Map) {
    const viewModel = this.polyLineFromTrack(trk);
    if (!this.allLayers.has(viewModel)){
      console.log("hii")
      this.allLayers = this.allLayers.add(viewModel);
    }
    console.log(this.allLayers)
    this.addToMap(viewModel.mapFeature, map);
    this.addToMap(viewModel.touchHelper, map);
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
  }

  public unFocusTrack(map: L.Map){
    map.invalidateSize();
    this.markers.forEach(m => m.remove());
    this.unfocusEvent.next(true);
  }

  public addToMap(l: L.Layer, map: L.Map){
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
