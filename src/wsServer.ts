import { WebSocketServer } from 'ws';


const WS_PORT = 8080;

const wsServer = new WebSocketServer({ port: WS_PORT });



process.on('SIGINT', function() {
    process.exit();
});

process.on('exit', code => {
    wsServer.close();
    console.log('\n Process Exit');
}); 



// let isAlive = true;

// function heartbeat() {
//     isAlive = true;
// }

//   wsServer.on('connection', function connection(ws) {
//     isAlive = true;
//     ws.on('pong', heartbeat);
//   });
  
//   const interval = setInterval(function ping() {
//     wsServer.clients.forEach(function each(ws) {
//       if (isAlive === false) return ws.terminate();
  
//       isAlive = false;
//       ws.ping();
//     });
//   }, 30000);
  
//   wsServer.on('close', function close() {
//     console.log('WebSocket closed.');
//     clearInterval(interval);    
//   });


export { wsServer }