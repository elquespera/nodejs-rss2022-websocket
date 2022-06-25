import robot from 'robotjs';

import convertBitmapToPNG from './convertImage.js';

class MouseController {
    constructor() {
        robot.setMouseDelay(0);
    }

    private moveTo(x: number, y: number, safeWidth?: number, safeHeight?: number) {
        if (safeWidth) {
            if (!safeHeight) safeHeight = safeWidth;
            const {width: screenWidth, height: screenHeight} = robot.getScreenSize();
            x = Math.max(safeWidth / 2, Math.min(screenWidth - safeWidth / 2, x));
            y = Math.max(safeHeight / 2, Math.min(screenHeight - safeHeight / 2, y));
        }
        robot.moveMouse(x, y);
    }

    private moveBy(offsetX: number, offsetY: number, safeWidth?: number, safeHeight?: number) {
        const { x, y } = robot.getMousePos();
        this.moveTo(x + offsetX, y + offsetY, safeWidth, safeHeight);
    }

    public moveUp(offset: number) {
        this.moveBy(0, -offset);
    }
    public moveDown(offset: number) {
        this.moveBy(0, offset);
    }
    public moveLeft(offset: number) {
        this.moveBy(-offset, 0);
    }
    public moveRight(offset: number) {
        this.moveBy(offset, 0);
    }

    get formattedPosition(): string  {
        const { x, y } = robot.getMousePos();
        return `${x},${y}`;
    }

    private drawRectangleAt(x: number, y: number, width: number, height: number): void {          
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

    public drawRectangle(width: number, height: number): void {   
        const { x, y } = robot.getMousePos();
        this.drawRectangleAt(x, y, width, height);
    }

    public drawSquare(side: number): void {
        this.drawRectangle(side, side);
    }

    private drawCircleAt(x: number, y: number, radius: number): void {        
        robot.mouseToggle('down');
        for (let i = 0; i <= Math.PI * 2; i += 0.01) {
            robot.dragMouse(x + (radius * Math.cos(i)), 
                            y + (radius * Math.sin(i)));
        }
        robot.mouseToggle('up');
    }

    public drawCircle(radius: number): void {
        this.moveBy(radius, 0, radius * 2);
        const { x, y } = robot.getMousePos();        
        this.drawCircleAt(x, y, radius);
    }

    public async printScreen(): Promise<string> {
        const captureSize = 200;

        const { x, y } = robot.getMousePos(); 
        const screenBitmap = robot.screen.capture(x, y, captureSize, captureSize);

        // For highDPI displays
        const multi = screenBitmap.width / captureSize;
        
        return await convertBitmapToPNG(screenBitmap, multi);
    }
}

export default MouseController;