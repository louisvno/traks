import { optimizeImage } from "./vendor/image-optimizer";
import { ImageOptions } from "./vendor/image-options";

const fs = require('fs')
const path = require('path');

const imageOptions: ImageOptions = {
    format: 'jpeg',
    destinationPath: './src/assets/media/',
    width: 480,
    quality: 80,
    inputImagePath: ''
}

export const copyAssets = async (tracksFolder) => {
    const tracks = fs.readdirSync(tracksFolder);
    
    if (!fs.existsSync(imageOptions.destinationPath)){
        fs.mkdirSync(imageOptions.destinationPath);
    }

    for (const dirent of tracks) {
        const dirContents: string[] = fs.readdirSync(path.join(tracksFolder, dirent));

        const images = getImagesInDir(dirContents);
        const metaData = JSON.parse(fs.readFileSync(path.join(tracksFolder, dirent, 'metaData.json'), 'utf8'));
    
        if(!!images.length) {
            images.forEach(async (image) => {
                validateMetaData(metaData, image);
                
                await optimizeImage( { ...imageOptions, inputImagePath: path.join(tracksFolder, dirent, image) });
            });
        }
    }
}

const validateMetaData = (metaData, fileName) => {  
    if(!metaData.poiImages.find(img => img.fileName === fileName)){
        console.warn(`Image ${fileName} is not in the metadata.json file`);
    }
}

const getImagesInDir = (dirContents: string[]) => {
    return dirContents.filter((file) => file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg"));
}
