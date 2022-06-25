import os from 'os';

import MouseController from './mouseController.js';

import { Transform, TransformCallback, TransformOptions, Duplex } from 'stream';

const mouseCommands = {
    UP: 'mouse_up',
    DOWN: 'mouse_down',
    LEFT: 'mouse_left',
    RIGHT: 'mouse_right',
    POSITION: 'mouse_position',

    CIRCLE: 'draw_circle',
    RECTANGLE: 'draw_rectangle',
    SQUARE: 'draw_square',

    PRINT_SCREEN: 'prnt_scrn'
}


class WsController extends Transform {
    wsStream: Duplex;
    mouseController: MouseController;

    constructor(wsStream: Duplex, options: TransformOptions) {
        super(options);
        this.wsStream = wsStream;
        this.mouseController = new MouseController();
    }
    

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        const commands = chunk.toString();
        const params = commands.split(' ');
        const command = params[0];
        params.shift();

        this.push(`Received command: ${commands}${os.EOL}`);
        
        let answer = '';
        let status = 'completed successfully';
        try {
            switch (command) {
                case mouseCommands.UP:
                    this.mouseController.moveUp(parseInt(params[0]));
                    break;
                case mouseCommands.DOWN:
                    this.mouseController.moveDown(parseInt(params[0]));
                    break;            
                case mouseCommands.LEFT:
                    this.mouseController.moveLeft(parseInt(params[0]));
                    break;            
                case mouseCommands.RIGHT:
                    this.mouseController.moveRight(parseInt(params[0]));
                    break;            
                case mouseCommands.POSITION:   
                    answer = this.mouseController.formattedPosition; 
                    break;
                case mouseCommands.SQUARE:
                    this.mouseController.drawSquare(parseInt(params[0]));
                    break;                
                case mouseCommands.RECTANGLE:
                    this.mouseController.drawRectangle(parseInt(params[0]), parseInt(params[1]));
                    break;                
                case mouseCommands.CIRCLE:
                    this.mouseController.drawCircle(parseInt(params[0]));
                    break;   
                case mouseCommands.PRINT_SCREEN:
                    answer = this.mouseController.printScreen();
                    break;                
            }
        }
        catch (error) {
            status = `error - ${error.message}`;
        }

        this.wsStream.write(command + ' ' + answer);
        callback(null, `${command} ${answer}: ${status} ${os.EOL}`);
    }
}


export { WsController }