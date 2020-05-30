import { scan, shareReplay, publishReplay, refCount } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'Leaflet.MultiOptionsPolyline'
import { RoadColors } from './model/RoadType.model';
import { Track } from './model/TrackMetaData.model';
import { Subject,Subscription, ConnectableObservable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private trackListSub: Subscription;
  public trackSelected = new Subject<L.MultiOptionsPolyline>();
  public trackCreated = new Subject<L.MultiOptionsPolyline>();
  public trackList = this.trackCreated.pipe(
    scan((acc, curr)=> {
      acc.push(curr)
      console.log(acc)
      return acc;
    },[]),
    publishReplay(1)) as ConnectableObservable<L.MultiOptionsPolyline[]>;
  //NICETOHAVE possibility for different loader implementation TrackLoader
  constructor(private http: HttpClient) {
    this.trackListSub = this.trackList.connect();
    this.loadTracksInView();
  }
 
  async loadTracksInView(){
    // for the moment loads all tracks
    const trackList = await this.http.get<[]>('/assets/tracks/tracklist.json',
      {responseType: 'json'}).toPromise();

    //get tracks
    const trkList = trackList.forEach((async (trk) => {
      let track : Track = await this.http.get<Track>(`/assets/tracks/${trk}`,
      {responseType: 'json'}).toPromise();

      // Render segments
      let polyline = L.multiOptionsPolyline(
        track.coordinates, 
          {multiOptions: {
            optionIdxFn: (latLng,_,index) => {
              return track.roadTypeArray[index];
            },
            options: [{color: RoadColors.GRAVEL}, {color: RoadColors.ASPHALT}, {color: RoadColors.COBBLE}]
          }});
          console.log(polyline)
      this.trackCreated.next(polyline);
      
      polyline.on('click', (event: L.LeafletEvent) => {
        this.trackSelected.next(polyline);
      })
    }));
  }
}
