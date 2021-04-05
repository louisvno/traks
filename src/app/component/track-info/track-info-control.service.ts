import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackInfoControlService {

  public closeTrackInfo = new Subject<boolean>();
  public nextTrack = new Subject<boolean>();
  public previousTrack = new Subject<boolean>();
  constructor() { }
}
