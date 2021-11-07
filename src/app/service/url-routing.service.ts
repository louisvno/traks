import { Injectable } from "@angular/core";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { filter, withLatestFrom } from "rxjs/operators";
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
    // use other combine  
    combineLatest([this.navigationEnd, this.layerService.mapAndTracksLoaded])
    .pipe(withLatestFrom(this.layerService.selectedTrack))
    .subscribe((([[event, _], selectedTrack]) => {

      const trackName = event.url.slice(1);
      
      if (trackName) {

        const track = this.layerService.allLayers.find(vm => vm.model.fileName === trackName);

        if(!track) {
          //remove invalid track id from url, no new navigation event
          // TODO show message to user
          this.router.navigate(['/']);
          return;
        }

        if (track.model.fileName !== selectedTrack?.model.fileName) {
          this.layerService.selectedTrack.next(track);
          return;
        } 
      }
    }));
  }
}