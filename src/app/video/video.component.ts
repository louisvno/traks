import { Component, ElementRef, Input, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
let apiLoaded;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @ViewChild('iframe-container')
  iframeContainer: ElementRef<HTMLElement>;

  @Input()
  videoId: string;
  videoUrl
  constructor(private sanitizer: DomSanitizer) { }
 
  ngOnInit(): void {
    //TODO check lazy loading
    if(this.videoId){
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${this.videoId}?dnt=1`);
    }
  }

}
