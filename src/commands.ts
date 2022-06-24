import { WebSocket } from "ws";
import robot from 'robotjs';
import os from 'os';

import { Transform, TransformCallback, TransformOptions } from 'stream';

const mouseCommands = {
    UP: 'mouse_up',
    DOWN: 'mouse_down',
    LEFT: 'mouse_left',
    RIGHT: 'mouse_right',
    POSITION: 'mouse_position',

    CIRCLE: 'draw_circle',
    RECTANGLE: 'draw_rectangle',
    SQUARE: 'draw_square'
}


class WsTranform extends Transform {
    ws: WebSocket;
    constructor(ws: WebSocket, options: TransformOptions) {
        super(options);
        this.ws = ws;
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const commands = chunk.toString();
        const params = commands.split(' ');
        const command = params[0];
        params.shift();
        
    
        const { x, y } = robot.getMousePos();
    
        switch (command) {
            case mouseCommands.UP:
                robot.moveMouse(x, y - parseInt(params[0]));
                break;
            case mouseCommands.DOWN:
                robot.moveMouse(x, y + parseInt(params[0]));
                break;            
            case mouseCommands.LEFT:
                robot.moveMouse(x - parseInt(params[0]), y);
                break;            
            case mouseCommands.RIGHT:
                robot.moveMouse(x + parseInt(params[0]), y);
                break;            
            case mouseCommands.POSITION:
                this.ws.send(`mouse_position ${x},${y}`);
                break;
        }
        callback(null, `Received command: ${commands}${os.EOL}`);
    }
}

// function parseCommand(commands:string, ws: WebSocket):void {
//     const params = commands.split(' ');
//     const command = params[0];
//     params.shift();
//     console.log(params);
//     console.log(`Received command: ${commands}`);

//     const { x, y } = robot.getMousePos();

//     switch (command) {
//         case mouseCommands.UP:
//             robot.moveMouse(x, y - parseInt(params[0]));
//             break;
//         case mouseCommands.DOWN:
//             robot.moveMouse(x, y + parseInt(params[0]));
//             break;            
//         case mouseCommands.LEFT:
//             robot.moveMouse(x - parseInt(params[0]), y);
//             break;            
//         case mouseCommands.RIGHT:
//             robot.moveMouse(x + parseInt(params[0]), y);
//             break;            
//         case mouseCommands.POSITION:
//             ws.send(`mouse_position ${x},${y}`);
//             break;
//     }

// }


export { mouseCommands, WsTranform }