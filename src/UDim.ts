class UDim {
    private canvas: HTMLCanvasElement;
    private _scale: Vector;
    private _offset: Vector;
    private _absolute: Vector;

    public constructor(canvas: HTMLCanvasElement, scaleX: number, offsetX: number, scaleY: number, offsetY: number) {
        this.canvas = canvas;
        this._scale = new Vector(scaleX, scaleX);
        this._offset = new Vector(offsetX, offsetY);
        this.calculateAbsolute();
    }

    public static fromScale(canvas: HTMLCanvasElement, x: number, y: number): UDim {
        return new UDim(canvas, x, 0, y, 0);
    }

    public static fromOffset(canvas: HTMLCanvasElement, x: number, y: number): UDim {
        return new UDim(canvas, 0, x, 0, y);
    }
    
    private calculateAbsolute(): void {
        this._absolute = new Vector(this.scale.x * this.canvas.width + this._offset.x, this.scale.y * this.canvas.height + this._offset.y);
    }
    
    public get absolute(): Vector {
        return this._absolute.copy();
    }
    
    public get scale(): Vector {
        return this._scale.copy();
    }
    
    public get offset(): Vector {
        return this._offset.copy();
    }
    
    public addScale(v: Vector) {
        this._scale.add(v);
        this.calculateAbsolute();
    }
    
    public subScale(v: Vector) {
        this._scale.sub(v);
        this.calculateAbsolute();
    }
    
    public addOffset(v: Vector) {
        this._offset.add(v);
        this.calculateAbsolute();
    }
    
    public subOffset(v: Vector) {
        this._offset.sub(v);
        this.calculateAbsolute();
    }

    public lerp(u: UDim, alpha: number) {
        this._scale.lerp(u._scale, alpha);
        this._offset.lerp(u._offset, alpha);
        this.calculateAbsolute();
    }
}