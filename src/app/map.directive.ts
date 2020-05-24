import { MapService } from './map.service';
import { Directive, ElementRef, Input } from '@angular/core';
import * as L from 'leaflet';

@Directive({
  selector: '[appMap]'
})
export class MapDirective {

  private map;
  //initial zoomlevel
  @Input()
  public zoomLevel;
  //initial longitude
  @Input()
  public long;
  //initial latitude
  @Input()
  public lat;
  
  constructor(private element: ElementRef, private mapService: MapService) { 
    
    this.map = L.map(element.nativeElement)
    .setView([41.5, 2.14], 10);

    this.mapService.register(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);
  }
}
