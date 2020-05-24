
let tj = require('@tmcw/togeojson'),
fs = require('fs'),
DOMParser = require('xmldom').DOMParser;

let gpx = new DOMParser().parseFromString(fs.readFileSync('./data/tracks/castellar_caldes_1/track_20200301_114347_castellar-caldes_edit_optimized.gpx', 'utf8'));
let meta = fs.readFileSync('./data/tracks/castellar_caldes_1/metadata.json');
let converted = tj.gpx(gpx);
converted.metaData = JSON.parse(meta);

fs.writeFileSync('./src/assets/tracks/conv.geojson',JSON.stringify(converted));