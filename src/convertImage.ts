import Jimp from 'jimp';

import { Bitmap } from "robotjs";

async function convertBitmapToPNG(bitmap: Bitmap, multi: number = 1): Promise<string> {
    let buffer: Buffer;

    const image = new Jimp(bitmap.width, bitmap.height, (err, image) => {
    });

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
        const color = bitmap.colorAt(x * multi, y * multi);
        // console.log(color);
        image.setPixelColor(Jimp.cssColorToHex(color), x, y);
        // console.log(image.getPixelColor(x, y));
    });


    buffer = await image.getBufferAsync(Jimp.MIME_PNG);

    
    return buffer.toString('base64');
}

export default convertBitmapToPNG; 



// const buff = new Buffer.from(JSON.stringify(newConfigFile, null, 2));
// const base64Config = buff.toString("base64");

// if (i % 4 === 0) {  
//     [image.image[i], image.image[i + 2]] = [image.image[i + 2],image.image[i]] // bgr -> rgb color
//     }   