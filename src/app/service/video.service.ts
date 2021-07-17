import { ElementRef, Injectable } from '@angular/core';
import  Player  from '@vimeo/player';
import { from, Observable, ReplaySubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TimeCoordinate } from '../model/TrackMetaData.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private player: Player;
  playerDestroy$ = new Subject<string>();
  private player$ = new ReplaySubject<Player>(1);

  observePlayerTime(): Observable<any> {
    return this.playerLoaded().pipe(
      switchMap(
      (player: Player) => new Observable(observer =>{
        player.on('timeupdate', (val) => observer.next(val))
      })
    ))
  }

  playerLoaded(){
    return this.player$.pipe(
      switchMap(
      (player) => new Observable(observer =>{
        player.on('loaded', (val) => observer.next(player))
      })
    ))
  }

  setPlayer(container: ElementRef, videoId: any){

    this.player = new Player(container.nativeElement, {id: videoId, maxheight: 200});
    this.player$.next(this.player);
  }

  getPlayer() {
    return this.player;
  }

  getCoordsByTime(time: number, coords: TimeCoordinate[]){
    return coords.find(c => c.time >= time);
  }

  destroyPlayer() {
    this.player.destroy();
    this.playerDestroy$.next();
  }
}
