import { HttpClient } from '@angular/common/http';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  //this w
  //ill emit array of the available tracks

  constructor(private mapService: MapService, private http: HttpClient) {
      mapService.map.subscribe(map=>{
        this.loadTracksInView(map);
      })
  }
 
  async loadTracksInView(map: L.Map){
    let metadata = {
      "segments": [
          {
              "start": 0,
              "end": 184,
              "roadType": 1,
              "roughness": 2
          },
          {
              "start": 184,
              "end": 343,
              "roadType": 2,
              "roughness": 0
          },
          {
              "start": 343,
              "end": 349,
              "roadType": 0,
              "roughness": 5
          }
      ]
    };
    let route : any = await this.http.get('/assets/tracks/tracks.geojson',
    {responseType: 'json'}).toPromise();
    //let parser = new gpxParser(); //properties copied
    // Load paths
    let arrLatLong = route.features[0].geometry.coordinates[0].map(arr => arr.reverse());
    console.log(arrLatLong)
    const roadColor = ['red','green','brown'];
    // Render segments
    metadata.segments.forEach(seg => {
      let polyline = L.polyline(
        arrLatLong.slice(seg.start, seg.end+1), 
        {color: roadColor[seg.roadType],
         smoothFactor: 1.5});
      polyline.addTo(map);
    });
  }
}
