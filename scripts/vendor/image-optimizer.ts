import { ImageOptions } from "./image-options";

const path = require('path');
const sharp = require('sharp');

export const optimizeImage = async (imageOptions: ImageOptions) => {

    return sharp(imageOptions.inputImagePath)
        .resize({ width: imageOptions.width }) // Resize image width (optional)
        .toFormat(imageOptions.format, { quality: imageOptions.quality }) // Convert to JPEG with quality
        .toFile(path.join(imageOptions.destinationPath, `${path.basename(imageOptions.inputImagePath, path.extname(imageOptions.inputImagePath))}.${imageOptions.format}`))
        .catch(err => console.error(`Error processing ${imageOptions.inputImagePath}:`, err))
};
