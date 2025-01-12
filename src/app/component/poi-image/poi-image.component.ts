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
    this.imageUrl = this.replaceFileExtension(this.data.imgUrl, '.jpeg');
  }

  replaceFileExtension(filePath, newExtension) {
    // Find the last dot in the file path
    const lastDotIndex = filePath.lastIndexOf('.');
    
    // If a dot is found, replace the extension
    if (lastDotIndex !== -1) {
        return filePath.substring(0, lastDotIndex) + newExtension;
    }
    
    // If no extension is found, just append the new extension
    return filePath + newExtension;
}

}
