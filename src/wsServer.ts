import { WebSocketServer } from 'ws';


const WS_PORT = 8080;

const wsServer = new WebSocketServer({ port: WS_PORT });


process.on('SIGINT', () => {
    process.stdout.write('Closing websocket...\n');
    wsServer.close();
    process.exit(0);
});


export { wsServer }