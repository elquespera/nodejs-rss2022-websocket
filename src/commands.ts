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
        robot.mouseToggle('down');
        for (let i = 0; i < width; i++) {
            robot.dragMouse(x + i, y);
        }
        for (let i = 0; i < height; i++) {
            robot.dragMouse(x + width, y + i);
        }
        for (let i = width; i >= 0; i--) {
            robot.dragMouse(x + i, y + height);
        }
        for (let i = height; i >= 0; i--) {
            robot.dragMouse(x, y + i);
        }
        robot.mouseToggle('up');
    }
    
    private drawSquare(x: number, y: number, side: number): void {
        this.drawRectangle(x, y, side, side);
    }

    private drawCircle(x: number, y: number, radius: number): void {
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
            robot.dragMouse(x + (radius * Math.cos(i)), 
                            y + (radius * Math.sin(i)));
        }
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const commands = chunk.toString();
        const params = commands.split(' ');
        const command = params[0];
        params.shift();
        
        robot.setMouseDelay(0);
        const { x, y } = robot.getMousePos();
        let answer = commands;
    
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
                answer = `mouse_position ${x},${y}`; 
                break;
            case mouseCommands.SQUARE:
                this.drawSquare(x, y, parseInt(params[0]));
                break;                
            case mouseCommands.RECTANGLE:
                this.drawRectangle(x, y, parseInt(params[0]), parseInt(params[1]));
                break;                
            case mouseCommands.CIRCLE:
                this.drawCircle(x, y, parseInt(params[0]));
                break;   
        }


        // const buff = new Buffer.from(JSON.stringify(newConfigFile, null, 2));
        // const base64Config = buff.toString("base64");

        // if (i % 4 === 0) {  
        //     [image.image[i], image.image[i + 2]] = [image.image[i + 2],image.image[i]] // bgr -> rgb color
        //     }        

        this.wsStream.write(answer);
        callback(null, `Received command: ${commands}${os.EOL}`);
    }
}


export { mouseCommands, WsTranform }