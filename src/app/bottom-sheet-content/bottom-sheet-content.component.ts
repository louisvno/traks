import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-bottom-sheet-content',
  templateUrl: './bottom-sheet-content.component.html',
  styleUrls: ['./bottom-sheet-content.component.scss']
})
export class BottomSheetContentComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public model: any, private _bottomSheetRef: MatBottomSheetRef<BottomSheetContentComponent>) { }

  ngOnInit(): void {
  }

  close(){
    this._bottomSheetRef.dismiss();
  }

}
