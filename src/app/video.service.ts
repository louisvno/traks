import { Player } from '@vimeo/player';
import { Injectable } from '@angular/core';
import { fromEvent, fromEventPattern, Observable, ReplaySubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  playerDestroy$ = new Subject<string>();
  private player$ = new ReplaySubject<Player>();
  //private videoPlayer: Player;

  constructor() { 
    this.observePlayerTime().subscribe(res => console.log(res))
  }
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
    //this.videoPlayer = player;
    console.log("new player set")
    this.player$.next(player);
  }

}
