import { Track, TrackBounds, Segment } from "src/app/model/TrackMetaData.model";
import { LatLng } from 'leaflet';
import { Dirent } from 'fs';
const xml2js = require('xml2js'),
fs = require('fs'),
path = require('path');

const trackMapper = (gpxJson, metaData): Track => {
    const track = {} as Track;
    track.coordinates = gpxJson.gpx.trk[0].trkseg[0].trkpt
        .map(pt =>{ 
            return {lat:pt.$.lat , lng: pt.$.lon} as LatLng
        });

    if(metaData){
        track.bounds = boundsMapper(gpxJson.gpx.metadata.find(obj => obj.hasOwnProperty("bounds")));
        track.roadTypeArray = track.coordinates.map(
            (_, index) => roadTypeMapper(metaData.segments, index)
        );
    }
    
    return track;
}

const roadTypeMapper = (segments: Segment[], index: number) => {
        for (let i = 0; i < segments.length; i++) {
          if(index <= segments[i].end) {
            return segments[i].roadType;
          } 
        } 
}

const boundsMapper = (boundsJson): TrackBounds => {
    return boundsJson.bounds[0].$;
}

const parseGpx = (tracksFolder) => {
    const tracks = fs.readdirSync(tracksFolder);
    const parser = new xml2js.Parser();
    const dest = './src/assets/tracks/';

    for (const dirent of tracks) {
        const dirContents = fs.readdirSync(path.join(tracksFolder, dirent));
        const metaData = dirContents.find((file) => file.startsWith("metadata"));
        const gpxTrk = dirContents.find((file) => file.endsWith(".gpx"))
        const gpx = fs.readFileSync(path.join(tracksFolder, dirent, gpxTrk), 'utf8');
        const meta = JSON.parse(fs.readFileSync(path.join(tracksFolder, dirent, metaData)));
        const outfile = path.parse(gpxTrk);
        
        parser.parseStringPromise(gpx)
            .then(data => 
                fs.writeFileSync(path.join(dest, path.format({name: outfile.name, ext: '.json'})),
                                 JSON.stringify(trackMapper(data,meta))));    
    }
}

parseGpx("./data/tracks");