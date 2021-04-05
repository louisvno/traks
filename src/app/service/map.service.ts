import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  
  public map = new ReplaySubject<L.Map>(1);
  constructor() { }

  register(map){
    this.map.next(map)
  }
}
