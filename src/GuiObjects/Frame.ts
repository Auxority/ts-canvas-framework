interface FrameSettings extends GuiSettings {

}

class Frame extends GuiObject {
    public constructor(canvas: HTMLCanvasElement, settings?: FrameSettings) {
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
        if (this.rotation !== 0) {
            const center: Vector = Vector.add(actualPosition, Vector.mul(actualSize, 0.5));
            this.ctx.translate(center.x, center.y);
            this.ctx.rotate(this.rotation * Math.PI / 180);
            this.ctx.translate(-center.x, -center.y);
        }
        this.ctx.fillRect(actualPosition.x, actualPosition.y, actualSize.x, actualSize.y);
        if (this.borderSize !== 0) {
            this.ctx.beginPath();
            this.ctx.rect(actualPosition.x, actualPosition.y, actualSize.x, actualSize.y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}