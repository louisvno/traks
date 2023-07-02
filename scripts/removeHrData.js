// create a typescript function to remove all instances of <extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>84</gpxtpx:hr></gpxtpx:TrackPointExtension></extensions> from a gpx file and modify the file in place
const fs = require('fs')
const path = require('path');
const TRACK_DATA_FOLDER = "./data/tracks";

// create a prompt to get the filepath variable and pass it to the cleanFile function
const prompt = require('prompt');
const properties = [
    {   name: 'filepath',       
        description: 'path to file to clean',
        warning: `path must be relative to the ${TRACK_DATA_FOLDER}`
    },
];
prompt.start();
prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    cleanFile(result.filepath);
});

function onErr(err) {
    console.log(err);
    return 1;
}

const cleanFile  = (filePath) => {

    fs.readFile(path.join(TRACK_DATA_FOLDER, filePath), (err, data) => {
        if (err) {
            console.error(err)
            return
        }

        const regex = /<extensions><gpxtpx:TrackPointExtension><gpxtpx:hr>\d+<\/gpxtpx:hr><\/gpxtpx:TrackPointExtension><\/extensions>/g;
        const modifiedData = data.toString().replace(regex, '');

        fs.writeFile(path.join(TRACK_DATA_FOLDER, filePath), modifiedData, err => {
            if (err) {
                console.error(err)
                return
            }
        })
    })
}




