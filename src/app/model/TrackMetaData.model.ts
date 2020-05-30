import { RoadType } from './RoadType.model';

export interface TrackViewModel{
    model: Track,
    mapFeature: L.MultiOptionsPolyline
}

export interface Track {
    coordinates: L.LatLng[];
    activity: string;
    segments: Segment[];
    bounds : TrackBounds;
    roadTypeArray: RoadType[];
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