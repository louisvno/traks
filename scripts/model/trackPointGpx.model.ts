export interface TrackPointGpx {
    time: string;
    $: {
        lat: number;
        lon: number;
    };
    ele: number[];
}