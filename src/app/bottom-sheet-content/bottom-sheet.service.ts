import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class BottomSheetService{
    public closeBtn = new Subject();
    constructor(){}

}