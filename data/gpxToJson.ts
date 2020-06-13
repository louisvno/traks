import { Track, Segment, NgxChartSeries, NgxChartPoint } from "src/app/model/TrackMetaData.model";
import { LatLng } from 'leaflet';
/**
 * Parses gpx xml file
 * Simplifies gpx data
 * Generates Track model json
 */
const s=require('simplify-js'),
xml2js = require('xml2js'),
fs = require('fs'),
path = require('path'),
Decimal = require('decimal.js');

const trackMapper = (gpxJson, metaData): Track => {
    const track = {} as Track;
    const latLngs = gpxJson.gpx.trk[0].trkseg[0].trkpt
        .map(pt =>{ 
            return {lat: pt.$.lat , lng: pt.$.lon, alt: new Decimal(pt.ele[0]).round().toNumber()} as LatLng
        });
    const profile = getElevationProfile(latLngs);

    // follow ngx charts object scheme
    track.profile = [{
        name: "elevation",
        series: simplifyProfile(profile,0.5),
    }];

    // simplify track
    track.totalDistance = profile[profile.length -1].name;
    track.coordinates = simplifyTrack(latLngs)

    if(metaData){
        // TODO calculate bounds
        //track.bounds = boundsMapper(gpxJson.gpx.metadata.find(obj => obj.hasOwnProperty("bounds")));
        track.roadTypeArray = track.coordinates.map(
            (_, index) => roadTypeMapper(metaData.segments, index)
        );
        track.title = metaData.title;
        track.description = metaData.description;
        track.fileName;
    }

    return track;
}

const simplifyTrack = (latLngs: LatLng[]) => {    
    const points = latLngs.map(c => ({x: new Decimal(c.lat).toNumber(), y: new Decimal(c.lng).toNumber(), alt: c.alt}))
    console.log("Original n points: " + points.length);
    const reducedPoints = s(points, 0.00004, true).map(res => ({lat:res.x,lng:res.y} as LatLng));
    console.log("Number of points after optimization: " + reducedPoints.length );
    
    return reducedPoints;
}

const roadTypeMapper = (segments: Segment[], index: number) => {
        for (let i = 0; i < segments.length; i++) {
          if(index <= segments[i].end) {
            return segments[i].roadType;
          } 
        } 
}

const parseGpx = (tracksFolder) => {
    const tracks = fs.readdirSync(tracksFolder);
    const parser = new xml2js.Parser();
    const dest = './src/assets/tracks/';

    for (const dirent of tracks) {
        const dirContents = fs.readdirSync(path.join(tracksFolder, dirent));
        const metaData = dirContents.find((file) => file.startsWith("metadata"));
        const gpxTrk = dirContents.find((file) => file.endsWith(".gpx"))
        console.log("loading track: " + gpxTrk);
        const gpx = fs.readFileSync(path.join(tracksFolder, dirent, gpxTrk), 'utf8');
        const meta = JSON.parse(fs.readFileSync(path.join(tracksFolder, dirent, metaData)));
         
        const outfile = path.parse(gpxTrk);
        meta.fileName = outfile.name;
        meta.fileType = outfile.ext;

        parser.parseStringPromise(gpx)
            .then(data => 
                fs.writeFileSync(path.join(dest, path.format({name: outfile.name, ext: '.json'})),
                                 JSON.stringify(trackMapper(data,meta))));    
    }
}


const getElevationProfile = (latLngs: LatLng[]): {name:number, value: number}[] => {
    const distVsAlt= [];
    const profile: {name:number, value: number}[]=[];
    // map latLng to cumulative distance vs altitude
    for (let index = 0; index < latLngs.length-1; index++) {
        if (index === 0) {
            distVsAlt.push({x: 0, y: latLngs[index].alt});
            continue;
        }
        distVsAlt.push(
            {
                x: getDistanceBetween(latLngs[index-1].lat,latLngs[index-1].lng,latLngs[index].lat,latLngs[index].lng), 
                y: latLngs[index].alt
            })
    }

    distVsAlt.reduce((acc, curr, i) => {
        if(i === 0) profile.push({name: 0, value: curr.y});
        else profile.push({name: new Decimal(acc).add(new Decimal(curr.x)).toNumber(), value: curr.y});
        return new Decimal(acc).add(new Decimal(curr.x));
    }, 0);

    return profile;
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

const simplifyProfile= (data: any[] ,interval: number): NgxChartPoint[] =>  {
    const res =[];
    for (let count = 0; count < data.length; count= count + interval) {
        const elements = data
            .filter(val => val.name >= count && val.name < count + interval)
            .map(v => v.value)
        const n = elements.length;

        //not likely there are 0 points in 1km interval
        if(elements.length > 0){
            const mean = elements.reduce((acc, curr) => acc + curr)/n;
            res.push({name: count, value: mean})
        }

    }
    return res;
}

parseGpx("./data/tracks");