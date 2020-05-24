export class Track {
    coordinates: [][];
    metaData: TrackMetaData;
}

export class TrackMetaData {
    activity: string;
    segments: Segment[];
    bounds : {
        minlat: number,
        minlon: number,
        maxlat: number,
        maxlon: number,
    }
    roadTypeArray: [];
}

export class Segment {
    start: number;
    end: number;
    roadType: number;
    roughness: number;
}