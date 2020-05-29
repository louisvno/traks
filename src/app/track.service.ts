import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'Leaflet.MultiOptionsPolyline'
import { RoadColors } from './model/RoadType.model';
import { Track } from './model/TrackMetaData.model';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  constructor(private mapService: MapService, private http: HttpClient) {
      mapService.map.subscribe(map=>{
        this.loadTracksInView(map);
      })
  }
 
  async loadTracksInView(map: L.Map){
    const trackList = await this.http.get<[]>('/assets/tracks/tracklist.json',
    {responseType: 'json'}).toPromise();
    trackList.forEach(async trk => {
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
    polyline.addTo(map);
    } )   
  }
}
