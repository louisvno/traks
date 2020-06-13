import { HttpClient } from '@angular/common/http';
import { LayerService } from './layer.service';
import { TrackService } from './track.service';
import { Component } from '@angular/core';
import { pluck } from 'rxjs/operators';
import { Track } from './model/TrackMetaData.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'traks';
  public view = [700,300];
  public colorScheme = {
    domain: ['#5AA454']
  };
  public trkModel = this.layer.trackSelected.pipe(pluck('model'));

  constructor(private trackService: TrackService, private layer: LayerService, private http: HttpClient){
  }

  downloadGPX(model: Track){

    console.log(model)
    console.log(model.fileName.toString() + model.fileType)
    this.http.get('/assets/gpx/' + model.fileName + model.fileType, {responseType: 'blob'}).toPromise()
      .then(res => {
        saveAs(res,model.fileName + model.fileType);
      })
  }
}
