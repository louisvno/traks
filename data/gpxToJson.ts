
/*
*what would a builder schema look like
outputfolder
input folder
orrr just infile in metadata outfolder
orr check wich folders are not generated yet, foldername == outfilename
*/

import { Track, TrackBounds, Segment } from "src/app/model/TrackMetaData.model";
import { LatLng } from 'leaflet';
const xml2js = require('xml2js'),
fs = require('fs');

const trackMapper = (gpxJson, metaData): Track => {
    const track = {} as Track;
    track.coordinates = gpxJson.gpx.trk[0].trkseg[0].trkpt
        .map(pt =>{ 
            return {lat:pt.$.lat , lng: pt.$.lon} as LatLng
        });

    track.bounds = boundsMapper(gpxJson.gpx.metadata.find(obj => obj.hasOwnProperty("bounds")));
    track.roadTypeArray = track.coordinates.map(
        (_, index) => roadTypeMapper(metaData.segments, index)
    );
    
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

const parseGpx = (gpxPath, metaDataPath) => {
    const parser = new xml2js.Parser();
    let gpx = fs.readFileSync('./data/tracks/castellar_caldes_1/track_20200301_114347_castellar-caldes_edit_optimized.gpx', 'utf8');
    let meta = JSON.parse(fs.readFileSync('./data/tracks/castellar_caldes_1/metadata.json'));
    parser.parseStringPromise(gpx).then(data => fs.writeFileSync('./src/assets/tracks/conv.geojson',JSON.stringify(trackMapper(data,meta))));    
}

parseGpx("","");