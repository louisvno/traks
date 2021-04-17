import { Injectable } from "@angular/core";
import * as L from "leaflet";
import { ICON_PATHS } from "../config/icons";
import { TrackViewModel } from "../model/TrackMetaData.model";

@Injectable({
  providedIn: 'root',
})

export class MarkerService {
  
  public markers: L.Marker[] = [];
  
  constructor() {}
  
  public initMarkers(map: L.Map, l: L.Polyline){
    
    const latLngs = l.getLatLngs() as L.LatLng[];
    this.clearMarkers();
    
    const startIcon = new L.Icon({iconUrl: ICON_PATHS.routeStart, iconAnchor:[16,38]});
    const startMarker =new L.Marker(new L.LatLng(latLngs[0].lat, latLngs[0].lng),{icon: startIcon});
    startMarker.addTo(map);
    this.markers.push(startMarker)
    
    const endIcon = new L.Icon({iconUrl: ICON_PATHS.routeEnd, iconAnchor:[16,38]})
    const endMarker = new L.Marker(latLngs[latLngs.length -1],{icon: endIcon});
    endMarker.addTo(map);
    this.markers.push(endMarker)
  }
  
  public updateStartMarkerPosition(lat, lng) {
    
    const startMarker = this.markers[0];
    
    if(startMarker) {
      startMarker.setLatLng({lat, lng});
    }
  }

  public resetStartMarkerPosition(track: TrackViewModel) {
    const startMarker = this.markers[0];
    
    if(startMarker) {
      const l = track.mapFeature;
      const latLngs = l.getLatLngs() as L.LatLng[];
      startMarker.setLatLng(new L.LatLng(latLngs[0].lat, latLngs[0].lng));
    }
  }
  
  public clearMarkers() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}