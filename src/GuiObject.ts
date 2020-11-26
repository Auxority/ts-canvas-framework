interface GuiSettings {
    anchorPoint?: Vector;
    background?: Color;
    borderColor?: Color;
    borderSize?: number;
    position?: UDim;
    rotation?: number;
    size?: UDim;
    zIndex?: number;
}

abstract class GuiObject {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    protected anchorPoint: Vector;
    protected background: Color;
    protected borderColor: Color;
    protected borderSize: number;
    protected position: UDim;
    protected rotation: number;
    protected size: UDim;
    protected zIndex: number;

    public constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
    }

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }

    public getIndexZ(): number {
        return this.zIndex;
    }

    public rotate(degrees: number) {
        this.rotation += degrees;
    }

    public update(): void {
        this.position.addOffset(new Vector(0, 0));
        this.size.addOffset(new Vector(0, 0));
    }

    public draw(): void {}
}