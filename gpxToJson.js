
var tj = require('@mapbox/togeojson'),
fs = require('fs'),
// node doesn't have xml parsing or a dom. use xmldom
DOMParser = require('xmldom').DOMParser;

var gpx = new DOMParser().parseFromString(fs.readFileSync('./src/assets/tracks/castellar_caldes_1/track_20200301_114347_castellar-caldes_edit_optimized.gpx', 'utf8'));

var converted = tj.gpx(gpx);

fs.writeFileSync('./conv.geojson',JSON.stringify(converted));