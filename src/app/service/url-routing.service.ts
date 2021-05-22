import { Injectable } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { LayerService } from "./layer.service";

@Injectable({
  providedIn: 'root'
})
export class UrlRoutingService {
  
  private navigationEnd: Observable<RouterEvent>;
  
  constructor(private layerService: LayerService, private router: Router){
    this.init();
  }
  
  
  private init() {
    
    this.navigationEnd = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    );
      
    combineLatest([this.navigationEnd, this.layerService.mapAndTracksLoaded])
    .subscribe((([event, _]: [RouterEvent, boolean]) => {
      const trackname = event.url.slice(1);
      
      if (trackname) {
        const track = this.layerService.allLayers.find(vm => vm.model.fileName === trackname);
        
        if (track) {
          this.layerService.trackSelected.next(track);
        } else {
          //remove invalid track id from url, no new navigation event
          // TODO show message to user
          this.router.navigate(['/']);
        }
      }
    }));
  }
}