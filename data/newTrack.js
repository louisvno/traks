/**
 * Script to setup new track. Generates folder and metadata.json file.
 */
const prompt = require('prompt');
const fs = require('fs');
const properties = [
    {
        name: 'folder',
        description: 'name the parent folder for track info',
        warning: 'Username must be only letters, spaces, or dashes'
    },
    {
        name: 'title',
        description: 'track title as it will appear on screen',
        warning: 'Username must be only letters, spaces, or dashes'
    },
    {
        name: 'activity',
        description: 'track title as it will appear on screen',
        validator: /^[a-zA-Z\s\-]+$/,
        warning: 'Username must be only letters, spaces, or dashes'
    },
];

prompt.start();

prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    // todo create folder and json from results
    fs.mkdir('./data/tracks/' + result.folder,()=>{
        fs.writeFile('./data/tracks/' + result.folder + '/metadata.json', buildMetadata(result),()=>{});
    })
});

function buildMetadata(result){

    const metadata = {};
    metadata.title = result.title;
    metadata.activity = result.activity;
    metadata.description = '';

    return JSON.stringify(metadata,null,4);
}

function onErr(err) {
    console.log(err);
    return 1;
}
