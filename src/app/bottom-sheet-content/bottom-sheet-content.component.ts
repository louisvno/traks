import { BottomSheetService } from './bottom-sheet.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bottom-sheet-content',
  templateUrl: './bottom-sheet-content.component.html',
  styleUrls: ['./bottom-sheet-content.component.scss']
})
export class BottomSheetContentComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public model: any,
   private _bottomSheetRef: MatBottomSheetRef<BottomSheetContentComponent>,
   private _http: HttpClient,
   private service: BottomSheetService) { }

  ngOnInit(): void {
  }

  close(){
    this._bottomSheetRef.dismiss();
    this.service.closeBtn.next(true);
  }

  downloadGPX(){
    this._http.get('/assets/gpx/' + this.model.fileName + this.model.fileType, {responseType: 'blob'}).toPromise()
      .then(res => {
        saveAs(res,this.model.fileName + this.model.fileType);
      })
  }

}
