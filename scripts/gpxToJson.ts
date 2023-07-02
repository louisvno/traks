import { Track, NgxChartPoint } from "../src/app/model/TrackMetaData.model";
import { TrackPointMapper } from "./gpx-mapper/trackPointMapper";
/**
 * Parses gpx xml file
 * Simplifies gpx data
 * Generates Track model json
 */
const TRACK_DATA_FOLDER = "./data/tracks";

const simplify=require('simplify-js'),
xml2js = require('xml2js'),
fs = require('fs'),
path = require('path'),
Decimal = require('decimal.js');
const copyAssets = require('./processImages').copyAssets;
const differenceInSeconds = require('date-fns/differenceInSeconds')
const parseISO = require('date-fns/parseISO')
const colors =[
    '#276BB0',
    '#272AB0',
    '#5727B0',
    '#9C27B0',
    '#c2185B',
    '#E91E63',
    ];
type TrackPoint = {date: string, lat: number, lng: number, alt: number};

const trackMapper = (gpxJson, metaData): Track => {
    const track = {} as Track;
    const coordinates: TrackPoint[] = gpxJson.gpx.trk[0].trkseg[0].trkpt.map(TrackPointMapper.map);

    const rawProfile = getElevationProfile(coordinates);
    const profile = metaData.skipSimplifyProfile ? rawProfile : simplifyProfile(rawProfile,0.5);

    // follow ngx charts object scheme
    track.profile = [{
        name: "elevation",
        series: profile,
    }];

    track.maxElevation = profile
        .map(p => p.value)
        .reduce((a,b) => Math.max(a,b));

    track.minElevation = profile
        .map(p => p.value)
        .reduce((a,b) => Math.min(a,b));

    track.totalDistance = +profile[profile.length -1].name;

    const dateCoordinates = simplifyTrack(coordinates);

    track.coordinates = dateCoordinates.map(c => ({ lat: c.lat, lng: c.lng}));

    track.timeCoordinates = dateCoordinates.reduce((acc, curr, i) => {
        const newArr = [...acc];
        if (i === 0) {
            newArr.push({lat: curr.lat, lng: curr.lng, time: 0});
        } else{
            newArr.push({
                lat: curr.lat,
                lng: curr.lng, 
                time: differenceInSeconds(
                    parseISO(curr.date), parseISO(dateCoordinates[0].date))});
        }
        return newArr;
    }, [])
    if(metaData){
        track.title = metaData.title;
        track.description = metaData.description;
        track.fileName = metaData.fileName;
        track.fileType = metaData.fileType;
        track.videoId = metaData.videoId || '';
        track.poiImages = metaData.poiImages;
    }
    track.color = colors[Math.floor(Math.random() * 5)];
    
    return track;
}

const simplifyTrack = (latLngs) =>  {  
    
    const points = latLngs.map(c => (
    {
        x: new Decimal(c.lat).toNumber(), 
        y: new Decimal(c.lng).toNumber(), 
        alt: c.alt, 
        date: c.date
    }))
    
    console.log("Original n points: " + points.length);
    
    const reducedPoints = 
        simplify(points, 0.00004, true)
        .map(res => ({lat:res.x,lng:res.y, date: res.date}));

    console.log("Number of points after optimization: " + reducedPoints.length );
    
    return reducedPoints;
}

const parseGpx = (tracksFolder) => {
    const tracks = fs.readdirSync(tracksFolder);
    const parser = new xml2js.Parser();
    const dest = './src/assets/tracks/';

    for (const dirent of tracks) {
        const dirContents: string[] = fs.readdirSync(path.join(tracksFolder, dirent));
        const gpxTrk = dirContents.find((file) => file.endsWith(".gpx"))
        const gpx = fs.readFileSync(path.join(tracksFolder, dirent, gpxTrk), 'utf8');

        const meta = parseMetaData(path.join(tracksFolder, dirent));
         
        const outfile = path.parse(gpxTrk);
        meta.fileName = outfile.name;
        meta.fileType = outfile.ext;

        parser.parseStringPromise(gpx)
            .then(data => 
                fs.writeFileSync(path.join(dest, path.format({name: outfile.name, ext: '.json'})),
                                 JSON.stringify(trackMapper(data,meta))));    
    }
}

const parseMetaData = (parentDir) => {
    return JSON.parse(fs.readFileSync(path.join(parentDir, 'metadata.json')));
}

const getElevationProfile = (latLngs: TrackPoint[]): {name:number, value: number}[] => {
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

parseGpx(TRACK_DATA_FOLDER);
copyAssets(TRACK_DATA_FOLDER);