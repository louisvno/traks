import * as L from 'leaflet';

export interface TrackViewModel{
    mapFeature: L.Polyline,
    model: Track,
    touchHelper?: L.Polyline
}

export interface Track {
    activity: string;
    //bounds: TrackBounds; not used for the moment
    color: string;
    coordinates: {date: any, lat: number, lng: number, alt: number}[];
    description: string;
    // difficulty: string; not used for the moment
    fileName: string;
    fileType: string;
    maxElevation: number;
    minElevation: number;
    profile: NgxChartSeries[];
    poiImages: Image[];
    poiVideos: Video[];
    title: string;
    timeCoordinates: TimeCoordinate[];
    totalDistance: number;
    videoId?: string;
}

export interface Image {
    fileName: string;
    url: string;
    alt: string;
    coordinates: L.LatLngLiteral;
}

export interface Video {
    videoId: string;
}

export interface PoiVideo extends Video {
    coordinates: L.LatLng[];
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

export interface TimeCoordinate {
    time: number,
    lat: number,
    lng: number
}
export interface DateCoordinate {
    date: Date;
    coordinate: L.LatLng;
}