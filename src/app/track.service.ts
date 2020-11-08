import { scan, publishReplay, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from './model/TrackMetaData.model';
import { Subject,Subscription, ConnectableObservable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private trackListSub: Subscription;
  public trackLoaded = new Subject<Track>();
  public trackList = this.trackLoaded.pipe(
    scan((acc, curr)=> {
      acc.push(curr)
      return acc;
    },[]),
    publishReplay(1)) as ConnectableObservable<Track[]>;
    
  //NICETOHAVE possibility for different loader implementation TrackLoader
  constructor(private http: HttpClient) {
    this.trackListSub = this.trackList.connect();
    this.loadTracks();
  }
 
  async loadTracks(){
    // for the moment loads all tracks
    const trackList = await this.http.get<[]>('/assets/tracks/tracklist.json',
      {responseType: 'json'}).toPromise();

    //get tracks
    from(trackList).pipe(
      mergeMap(trk => this.http.get<Track>(`/assets/tracks/${trk}`,
      {responseType: 'json'}))
    )
    .subscribe(track => this.trackLoaded.next(track));  
  }
}
