const fs = require('fs')
const path = require('path');

export const copyAssets = (tracksFolder) => {
    const tracks = fs.readdirSync(tracksFolder);
    const fullSizeDestinationPath = './src/assets/media/';
    
    if (!fs.existsSync(fullSizeDestinationPath)){
        fs.mkdirSync(fullSizeDestinationPath);
    }

    for (const dirent of tracks) {
        const dirContents: string[] = fs.readdirSync(path.join(tracksFolder, dirent));

        const images = dirContents.filter((file) => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"));
        const metaData = JSON.parse(fs.readFileSync(path.join(tracksFolder, dirent, 'metaData.json'), 'utf8'));
    
        if(!!images.length) {
            images.forEach(image => {
                validateMetaData(metaData, image);

                fs.copyFile(path.join(tracksFolder, dirent, image), path.join(fullSizeDestinationPath, image),(err) =>{});
            });
        }
    }
}

const validateMetaData = (metaData, fileName) => {  
    if(!metaData.poiImages.find(img => img.fileName === fileName)){
        console.warn(`Image ${fileName} is not in the metadata.json file`);
    }
}