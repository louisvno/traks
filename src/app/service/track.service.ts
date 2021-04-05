import { mergeMap, buffer } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Track } from '../model/TrackMetaData.model';
import { Subject, BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  public trackLoaded = new Subject<Track>();
  public trackLoadComplete = new BehaviorSubject(false);
  public trackList = this.trackLoaded.pipe(buffer(this.trackLoadComplete));
    
  //NICETOHAVE possibility for different loader implementation TrackLoader
  constructor(private http: HttpClient) {
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
    .subscribe(
      track => this.trackLoaded.next(track),
      err => console.log("[TrackService] track load failed"),
      () => this.trackLoadComplete.next(true)
    );  
  }
}
