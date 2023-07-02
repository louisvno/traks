import { TrackPointGpx } from "../model/trackPointGpx.model";

const Decimal = require('decimal.js');

export class TrackPointMapper {
    public static map(trackPoint: TrackPointGpx): {date: string, lat: number, lng: number, alt: number} {

        return {
            date: trackPoint.time[0],
            lat: trackPoint.$.lat , 
            lng: trackPoint.$.lon, 
            alt: new Decimal(trackPoint.ele[0]).round().toNumber() 
        };
    }
} 