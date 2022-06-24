import Jimp from 'jimp';
import robot from 'robotjs';

import { createWebSocketStream } from 'ws';

import { httpServer } from './src/httpServer.js';
import { wsServer } from './src/wsServer.js';
import { pipeline } from 'stream/promises';

import { WsTranform } from './src/commands.js';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

wsServer.on('connection', async ws => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });

    const wsTranform = new WsTranform(wsStream, {});

    await pipeline(
        wsStream, 
        wsTranform,
        process.stdout
    );

    ws.close();
});

wsServer.on('close', () => {
    console.log('Websocket closed');
});
