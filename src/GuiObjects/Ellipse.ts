interface EllipseSettings extends GuiSettings {
    startAngle?: number;
    endAngle?: number;
    antiClockwise?: boolean;
}

class Ellipse extends GuiObject {
    private startAngle: number;
    private endAngle: number;
    private antiClockwise: boolean;

    public constructor(canvas: HTMLCanvasElement, settings?: EllipseSettings) {
        super(canvas);

        if (!settings) {
            settings = {};
        }
        
        this.anchorPoint = settings.anchorPoint || new Vector(0, 0);
        this.background = settings.background || Color.fromRGB(255, 255, 255);
        this.borderColor = settings.borderColor || Color.fromRGB(0, 0, 0);
        this.borderSize = settings.borderSize || 0;
        this.position = settings.position || new UDim(canvas, 0, 0, 0, 0);
        this.rotation = settings.rotation || 0;
        this.size = settings.size || new UDim(canvas, 0, 100, 0, 100);
        this.zIndex = settings.zIndex || 0;

        this.startAngle = settings.startAngle || 0;
        this.endAngle = settings.endAngle || 2 * Math.PI;
        this.antiClockwise = settings.antiClockwise || false;
    }

    private calculateAbsolutePosition(): Vector {
        return Vector.sub(this.position.absolute, Vector.mul(this.anchorPoint, this.size.absolute));
    }

    public draw(): void {
        this.ctx.save();

        const actualPosition: Vector = this.calculateAbsolutePosition();
        const actualSize: Vector = this.size.absolute;

        this.ctx.fillStyle = this.background.toString();
        this.ctx.strokeStyle = this.borderColor.toString();
        this.ctx.lineWidth = this.borderSize;
        this.ctx.beginPath();
        this.ctx.ellipse(actualPosition.x, actualPosition.y, 0.5 * actualSize.x, 0.5 * actualSize.y, this.rotation * Math.PI / 180, this.startAngle, this.endAngle, this.antiClockwise);
        this.ctx.fill();
        if (this.borderSize !== 0) {
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}