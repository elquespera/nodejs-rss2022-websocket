import { WebSocket } from "ws";
import robot from 'robotjs';
import os from 'os';

import { Transform, TransformCallback, TransformOptions, Duplex } from 'stream';

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
    wsStream: Duplex;
    constructor(wsStream: Duplex, options: TransformOptions) {
        super(options);
        this.wsStream = wsStream;
    }

    private drawRectangle(x: number, y: number, width: number, height: number): void {        
        for (let i = 0; i < width; i++) {
            robot.moveMouse(x + i, y);
        }
        for (let i = 0; i < height; i++) {
            robot.moveMouse(x + width, y + i);
        }
        for (let i = width; i >= 0; i--) {
            robot.moveMouse(x + i, y + height);
        }
        for (let i = height; i >= 0; i--) {
            robot.moveMouse(x, y + i);
        }
    }
    
    private drawSquare(x: number, y: number, side: number): void {
        this.drawRectangle(x, y, side, side);
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const commands = chunk.toString();
        const params = commands.split(' ');
        const command = params[0];
        params.shift();
        
        robot.setMouseDelay(0);
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
                this.wsStream.write(`mouse_position ${x},${y}`);
                break;
            case mouseCommands.SQUARE:
                this.drawSquare(x, y, parseInt(params[0]));
                break;                
            case mouseCommands.RECTANGLE:
                this.drawRectangle(x, y, parseInt(params[0]), parseInt(params[1]));
                break;                
        }

        callback(null, `Received command: ${commands}${os.EOL}`);
    }
}


export { mouseCommands, WsTranform }