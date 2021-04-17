import { TrackInfoControlService } from '../component/track-info/track-info-control.service';
import { TrackService } from './track.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import { withLatestFrom, delay, filter, take } from 'rxjs/operators';
import { Subject, Observable, combineLatest, ReplaySubject } from 'rxjs';
import { Set } from 'immutable'
import { Track, TrackViewModel } from '../model/TrackMetaData.model';
import * as L from 'leaflet';
import { RouterEvent, NavigationEnd, Router} from '@angular/router';
import { MarkerService } from './marker.service';

@Injectable({
  providedIn: 'root',
})
//rename to UI service or sth
export class LayerService {
  
  public allLayers: Set<TrackViewModel> = Set();

  public trackSelected: ReplaySubject<TrackViewModel> = new ReplaySubject(1);
  public unfocusEvent = new Subject<boolean>();
  public mapAndTracksLoaded = new Subject<boolean>();

  private navigationEnd: Observable<RouterEvent>;

  constructor(
    private mapService: MapService,
    private trackService:TrackService,
    private trackControls: TrackInfoControlService,
    private router : Router,
    private trackMarkerService: MarkerService,
  ) { 
      this.trackService.trackList.pipe(
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
        this.focusOnTrack(trk ,map)
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
        const trackname = event.url.slice(1);
        if(trackname) {
          console.info(trackname);
          const track = this.allLayers.find(vm => vm.model.fileName === trackname);
          if(track) {
            this.trackSelected.next(track);
          } else {
            //remove invalid track id from url, no new navigation event
            // TODO show message to user
            this.router.navigate(['/']);
          }
        }
      }))
  }

  private addTrack(trk: Track, map: L.Map) {
    const viewModel = this.polyLineFromTrack(trk);
    if (!this.allLayers.has(viewModel)){
      this.allLayers = this.allLayers.add(viewModel);
    }

    this.addToMap(viewModel.mapFeature, map);
    this.addToMap(viewModel.touchHelper, map);
  }

  public async focusOnTrack(trk : TrackViewModel, map: L.Map){

    const l = trk.mapFeature;
    map.invalidateSize();
    map.fitBounds(l.getBounds(),{padding:[0,20]});
    this.trackMarkerService.initMarkers(map, l);
  
    this.router.navigate([trk.model.fileName]);
  }

  public unFocusTrack(map: L.Map){

    map.invalidateSize();
    this.trackMarkerService.clearMarkers();
    this.unfocusEvent.next(true);
    this.router.navigate(['/'])
  }

  public addToMap(l: L.Layer, map: L.Map){

    if(!map.hasLayer(l)) l.addTo(map);
  }

  public polyLineFromTrack(track: Track): TrackViewModel{

    let polylineHelper = L.polyline( track.coordinates, {weight: 20, opacity:0 });
    let polyline = L.polyline(track.coordinates,{color: track.color})    

    polylineHelper.on('click', (event: L.LeafletEvent) => {
      this.trackSelected.next({model: track , mapFeature: polyline, touchHelper: polylineHelper});
    })  
    return {model: track , mapFeature: polyline,touchHelper: polylineHelper};
  }

}
