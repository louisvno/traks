import { Track, TrackBounds, Segment } from "src/app/model/TrackMetaData.model";
import { LatLng } from 'leaflet';
const xml2js = require('xml2js'),
fs = require('fs'),
path = require('path'),
Decimal = require('decimal.js');

const trackMapper = (gpxJson, metaData): Track => {
    const track = {} as Track;
    track.coordinates = gpxJson.gpx.trk[0].trkseg[0].trkpt
        .map(pt =>{ 
            return {lat: pt.$.lat , lng: pt.$.lon, alt: new Decimal(pt.ele[0]).round().toNumber()} as LatLng
        });
    if(metaData){
        track.bounds = boundsMapper(gpxJson.gpx.metadata.find(obj => obj.hasOwnProperty("bounds")));
        track.roadTypeArray = track.coordinates.map(
            (_, index) => roadTypeMapper(metaData.segments, index)
        );
        track.title = metaData.title;
        track.description = metaData.description;
    }
    const distVsAlt= [];

    for (let index = 0; index < track.coordinates.length-1; index++) {
        const coords = track.coordinates;
        if (index === 0) {
            distVsAlt.push({x: 0, y: track.coordinates[index].alt});
            continue;
        }
        distVsAlt.push(
            {
                x: getDistanceBetween(coords[index-1].lat,coords[index-1].lng,coords[index].lat,coords[index].lng), 
                y: coords[index].alt
            })
    }
    const profile = [];
    //sum distances
    distVsAlt.reduce((acc, curr, i) => {
        if(i === 0) profile.push({name: 0, value: curr.y});
        else profile.push({name: new Decimal(acc).add(new Decimal(curr.x)).toNumber(), value: curr.y});
        return new Decimal(acc).add(new Decimal(curr.x));
    }, 0);

    // follow ngx charts object
    track.profile = [{
        name: "Elevation",
        series: profile
    }];
    track.distance = distVsAlt
        .reduce((acc,curr)=> new Decimal(acc).add(new Decimal(curr.x)), 0);

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

//https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
const getDistanceBetween = (lat1, lon1, lat2, lon2) => {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    let res = 12742 * Math.asin(Math.sqrt(a));
    let roundedToMeter = Math.round(res *1000) / 1000;
    return roundedToMeter; // 2 * R; R = 6371 km
}

parseGpx("./data/tracks");