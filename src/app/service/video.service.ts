import { Player } from '@vimeo/player';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { TimeCoordinate } from '../model/TrackMetaData.model';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  playerDestroy$ = new Subject<string>();
  private player$ = new ReplaySubject<Player>(1);

  // possible to abstract away that player is not yet available?
  // possible to abstract away when player switches?
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

  setPlayer(player: Player){
    this.player$.next(player);
  }

  getCoordsByTime(time: number, coords: TimeCoordinate[]){
    return coords.find(c => c.time >= time);
  }
}
