import { RoadType } from './RoadType.model';

export interface TrackViewModel{
    mapFeature: L.Polyline,
    model: Track,
    touchHelper?: L.Polyline
}

export interface Track {
    activity: string;
    bounds : TrackBounds;
    coordinates: L.LatLng[];
    description: string;
    difficulty: string;
    fileName: string;
    fileType: string;
    maxElevation: number;
    minElevation: number;
    pois: any[];
    profile: NgxChartSeries[];
    roadTypeArray: RoadType[];
    title: string;
    totalDistance: number;
    color: string;
}

export interface TrackBounds {
    minlat: number,
    minlon: number,
    maxlat: number,
    maxlon: number,
}

export interface NgxChartSeries {
    name: string;
    series: NgxChartPoint[];
}
export interface NgxChartPoint {
    name: number | string;
    value: number
}