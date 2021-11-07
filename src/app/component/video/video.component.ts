import { VideoService } from '../../service/video.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { LayerService } from 'src/app/service/layer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {

  @ViewChild('iframeContainer')
  iframeContainer: ElementRef<HTMLElement>;
  trackSelectedSub: Subscription;

  constructor(private videoService: VideoService, private layerService: LayerService) { }

  ngAfterViewInit(): void {

    this.trackSelectedSub = this.layerService.selectedTrack.subscribe(track => {
      if(this.videoService.getPlayer()) this.videoService.destroyPlayer();
      // @ts-ignore
      this.videoService.setPlayer(this.iframeContainer, track.model.videoId);
    })
  }
 
  ngOnDestroy(): void {
    this.trackSelectedSub.unsubscribe();
    this.videoService.destroyPlayer();
  }
}
