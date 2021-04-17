import { VideoService } from '../../service/video.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import Player from '@vimeo/player'

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {

  @ViewChild('iframeContainer')
  iframeContainer: ElementRef<HTMLElement>;

  @Input()
  videoId: string;
  player: Player;
  constructor(private videoService: VideoService) { }

  ngAfterViewInit(): void {

    this.player = new Player(this.iframeContainer.nativeElement, {id: this.videoId, maxheight: 200});
    this.videoService.setPlayer(this.player);
  }
 
  ngOnDestroy(): void {
    this.videoService.playerDestroy$.next(this.videoId);
  }
}
