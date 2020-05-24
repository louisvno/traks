import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'Leaflet.MultiOptionsPolyline'
import { RoadTypes, RoadColors } from './model/RoadTypes.model';

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
    let track : any = await this.http.get('/assets/tracks/conv.geojson',
    {responseType: 'json'}).toPromise();
    let arrLatLong = track.features[0].geometry.coordinates;
    // Render segments
    let polyline = L.multiOptionsPolyline(
      arrLatLong
        .map(([long, lat, elev]) => [lat, long]), 
        {multiOptions: {
          optionIdxFn: (latLng,_,index) => {
            let segs = track.metaData.segments;
            // how to avoid looping too much? preproccessing to just return i directly
            // i dont like the gpx parsing result now, its not optimized for this
            for (let i = 0; i < segs.length; i++) {
              if(index <= segs[i].end) {
                return segs[i].roadType;
              } 
            } 
            return segs.length;
          },
          options: [{color: RoadColors.GRAVEL}, {color: RoadColors.ASPHALT}, {color: RoadColors.COBBLE}]
        }});
    polyline.addTo(map);
  }
}
