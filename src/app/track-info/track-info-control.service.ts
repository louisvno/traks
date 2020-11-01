import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackInfoControlService {

  public closeTrackInfo = new Subject<boolean>();
  public nextClicked = new Subject<boolean>();
  public previousClicked = new Subject<boolean>();
  constructor() { }
}
