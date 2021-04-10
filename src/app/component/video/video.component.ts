import { VideoService } from '../../service/video.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Player from '@vimeo/player'
import { withLatestFrom } from 'rxjs/operators';
import { LayerService } from 'src/app/service/layer.service';

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
  constructor(private videoService: VideoService, private layerService: LayerService) { }

  ngAfterViewInit(): void {
    //not called after tab change
    //so no new player created
    this.player = new Player(this.iframeContainer.nativeElement, {id: this.videoId, maxheight: 200});
    this.videoService.setPlayer(this.player);
  }
 
  ngOnInit(): void {
    console.log("init")

    this.videoService.observePlayerTime()
      .pipe(withLatestFrom(this.layerService.trackSelected))
      .subscribe(([time, trk]) => {
      
        const coord = this.videoService.getCoordsByTime(time.seconds, trk.model.timeCoordinates);
        this.layerService.updateStartMarkerPosition(coord.lat, coord.lng);
    })
  }

  ngOnDestroy(): void {
    console.log("video component destroyed")
    this.layerService.resetStartMarkerPosition();
    this.videoService.playerDestroy$.next(this.videoId);
  }
  



}
