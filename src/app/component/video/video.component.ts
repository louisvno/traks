import { VideoService } from '../../service/video.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Player from '@vimeo/player'

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('iframeContainer')
  iframeContainer: ElementRef<HTMLElement>;

  @Input()
  videoId: string;
  player: Player;
  constructor(private videoService: VideoService) { }

  ngAfterViewInit(): void {
    this.player = new Player(this.iframeContainer.nativeElement, {id: this.videoId});
    this.videoService.setPlayer(this.player);
    this.player.on('loaded', (val) => console.log('loaded'));
  }
 
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log("video component destroyed")
    //throw new Error('Method not implemented.');
  }
  



}
