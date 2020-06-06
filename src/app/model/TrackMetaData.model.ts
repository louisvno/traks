import { RoadType } from './RoadType.model';

export interface TrackViewModel{
    model: Track,
    mapFeature: L.MultiOptionsPolyline,
    touchHelper?: L.Polyline
}

export interface Track {
    title: string;
    description: string;
    coordinates: L.LatLng[];
    activity: string;
    segments: Segment[];
    bounds : TrackBounds;
    roadTypeArray: RoadType[];
    difficulty: string;
    pois: any[];
    totalDistance: number;
    profile: any[];
    fileName: string;
    fileType: string;
}

export interface TrackBounds {
        minlat: number,
        minlon: number,
        maxlat: number,
        maxlon: number,
}

export interface Segment {
    start: number;
    end: number;
    roadType: number;
    roughness: number;
}