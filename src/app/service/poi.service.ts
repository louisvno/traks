import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import * as L from "leaflet";
import { PointTuple } from "leaflet";
import { ICON_PATHS } from "../config/icons";
import { Track, Image } from "../model/TrackMetaData.model";
import { MatDialog } from '@angular/material/dialog'; 
import { PoiImageComponent } from "../component/poi-image/poi-image.component";
import { ScrollStrategyOptions } from "@angular/cdk/overlay";

@Injectable({
    providedIn: 'root'
})
export class POIService {

    private static startIconConfig: L.BaseIconOptions = {
        iconUrl: ICON_PATHS.routeStart, 
        iconAnchor:[16,38] as PointTuple,
      };
    
    POIs: {marker: L.Marker<L.Icon>, img: Image}[] = [];

    constructor(@Inject(DOCUMENT) private document,
                private dialog: MatDialog,
                private sso: ScrollStrategyOptions) {}

    initPOIsforTrack(map: L.Map, track: Track) {
        this.clearPOIs();

        track.poiImages?.forEach(img => {
            const {lat, lng} = img.coordinates;
            const icon = new L.Icon(POIService.startIconConfig);
            const marker = new L.Marker(new L.LatLng(lat, lng),{icon});
            const imageHTML: HTMLImageElement = this.document.createElement('img');
            console.log(img.fileName)

            marker.on('click', () => {
                this.dialog.open(PoiImageComponent, {data: 
                    {imgUrl: `/assets/media/${img.fileName}`,},
                    scrollStrategy: this.sso.block()
                });
            });
            marker.addTo(map);
            this.POIs.push({marker, img});
        })
    }

    clearPOIs() {
        this.POIs.forEach(poi => poi.marker.remove())
    }
  }  