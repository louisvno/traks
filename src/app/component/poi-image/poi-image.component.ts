import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  templateUrl: './poi-image.component.html',
  styleUrls: ['./poi-image.component.scss']
})
export class PoiImageComponent implements OnInit {

  imageUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {imgUrl: string}) { }

  ngOnInit(): void {
    this.imageUrl = this.data.imgUrl;
  }

}
