import Jimp from 'jimp';

import { Bitmap } from "robotjs";

async function convertBitmapToPNG(bitmap: Bitmap, multi: number = 1): Promise<string> {

    const image = new Jimp(bitmap.width, bitmap.height);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, i) => {
        const color = bitmap.colorAt(x * multi, y * multi);
        image.setPixelColor(Jimp.cssColorToHex(color), x, y);
    });

    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    return buffer.toString('base64');
}

export default convertBitmapToPNG; 