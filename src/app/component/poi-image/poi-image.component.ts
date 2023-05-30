import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
