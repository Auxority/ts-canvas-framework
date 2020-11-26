class Game {
    public static readonly MS_PER_GAME_TICK: number = 4;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private previous: number;
    private delta: number;
    private objects: GuiObject[]; //TODO move to other class

    public constructor(canvas: HTMLElement) {
        this.canvas = canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = window.innerWidth / 3;
        this.canvas.height = window.innerHeight;

        // TODO add onResize method that will rescale the *other class* and all it's elements.
        // TODO move to other class
        this.objects = [new Frame(this.canvas, {
            anchorPoint: new Vector(0.5, 0.5),
            borderSize: 5,
            borderColor: Color.fromRGB(255, 0, 0),
            position: new UDim(this.canvas, 0.5, 0, 0.5, 0),
            size: new UDim(this.canvas, 0.5, 0, 0.5, 0),
            zIndex: 0
        }), new Ellipse(this.canvas, {
            anchorPoint: new Vector(0, 0),
            background: Color.fromRGB(255, 255, 0),
            borderSize: 5,
            borderColor: Color.fromRGB(0, 0, 0),
            position: new UDim(this.canvas, 0.5, 0, 0.5, 0),
            size: new UDim(this.canvas, 0.5, 0, 0.5, 0),
            zIndex: 1
        })];

        window.addEventListener("resize", this.onResize);
        
        this.delta = 0;
        this.previous = performance.now();

        requestAnimationFrame(this.step);
    }

    private step = (step: number): void => {
        const elapsed: number = step - this.previous;
        this.previous = step;
        this.delta += elapsed;

        this.processInput();
        while (this.delta >= Game.MS_PER_GAME_TICK) {
            this.update();
            this.delta -= Game.MS_PER_GAME_TICK;
        }
        this.draw();

        requestAnimationFrame(this.step);
    }

    private processInput(): void {
        
    }

    private update(): void {
    
    }

    private draw(): void {
        // TODO move to other class
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.forEach((object: GuiObject, index: number) => {
            object.rotate(1);
            object.draw();
        });
    }

    private onResize = (): void => {
        this.canvas.width = window.innerWidth / 3;
        this.canvas.height = window.innerHeight;
        // TODO move to other class and only update when a new element is added or when an existing element is removed from the objects array.
        this.objects.forEach((object: GuiObject) => {
            object.update();
        });
        this.objects.sort((a, b) => {
            return a.getIndexZ() - b.getIndexZ();
        });
    }
}
