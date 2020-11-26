class Color {
    constructor(red, green, blue, alpha) {
        this.r = Math.max(0, Math.min(255, red));
        this.g = Math.max(0, Math.min(255, green));
        this.b = Math.max(0, Math.min(255, blue));
        this.a = Math.max(0, Math.min(1, alpha));
    }
    static random() {
        return Color.fromHSL(Math.round(Math.random() * 360), Math.round(Math.random() * 100), Math.round(Math.random() * 100));
    }
    lerp(target, alpha) {
        const invertA = 1 - alpha;
        this.r = this.r * invertA + target.r * alpha;
        this.g = this.g * invertA + target.g * alpha;
        this.b = this.b * invertA + target.b * alpha;
        this.a = this.a * invertA + target.b * alpha;
        return this;
    }
    static lerp(current, target, alpha) {
        const invertA = 1 - alpha;
        return Color.fromRGBa(current.r * invertA + target.r * alpha, current.g * invertA + target.g * alpha, current.b * invertA + target.b * alpha, current.a * invertA + target.a * alpha);
    }
    static fromRGB(red, green, blue) {
        return this.fromRGBa(red, green, blue, 1);
    }
    static fromRGBa(red, green, blue, alpha) {
        return new Color(red, green, blue, alpha);
    }
    static fromHSL(hue, saturation, lightness) {
        return this.fromHSLa(hue, saturation, lightness, 1);
    }
    static fromHSLa(hue, saturation, lightness, alpha) {
        saturation /= 100;
        lightness /= 100;
        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = lightness - c / 2;
        let r = 0;
        let g = 0;
        let b = 0;
        const smallHue = Math.floor(hue / 60);
        switch (smallHue) {
            case 0:
                r = c;
                g = x;
                break;
            case 1:
                r = x;
                g = c;
                break;
            case 2:
                g = c;
                b = x;
                break;
            case 3:
                g = x;
                b = c;
                break;
            case 4:
                r = x;
                b = c;
                break;
            case 5:
                r = c;
                b = x;
                break;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        return new Color(r, g, b, alpha);
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
class Game {
    constructor(canvas) {
        this.step = (step) => {
            const elapsed = step - this.previous;
            this.previous = step;
            this.delta += elapsed;
            this.processInput();
            while (this.delta >= Game.MS_PER_GAME_TICK) {
                this.update();
                this.delta -= Game.MS_PER_GAME_TICK;
            }
            this.draw();
            requestAnimationFrame(this.step);
        };
        this.onResize = () => {
            this.canvas.width = window.innerWidth / 3;
            this.canvas.height = window.innerHeight;
            this.objects.forEach((object) => {
                object.update();
            });
            this.objects.sort((a, b) => {
                return a.getIndexZ() - b.getIndexZ();
            });
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth / 3;
        this.canvas.height = window.innerHeight;
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
    processInput() {
    }
    update() {
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.forEach((object, index) => {
            object.rotate(1);
            object.draw();
        });
    }
}
Game.MS_PER_GAME_TICK = 4;
class GuiObject {
    constructor(canvas) {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext("2d");
    }
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    getIndexZ() {
        return this.zIndex;
    }
    rotate(degrees) {
        this.rotation += degrees;
    }
    update() {
        this.position.addOffset(new Vector(0, 0));
        this.size.addOffset(new Vector(0, 0));
    }
    draw() { }
}
class Player {
}
class UDim {
    constructor(canvas, scaleX, offsetX, scaleY, offsetY) {
        this.canvas = canvas;
        this._scale = new Vector(scaleX, scaleX);
        this._offset = new Vector(offsetX, offsetY);
        this.calculateAbsolute();
    }
    static fromScale(canvas, x, y) {
        return new UDim(canvas, x, 0, y, 0);
    }
    static fromOffset(canvas, x, y) {
        return new UDim(canvas, 0, x, 0, y);
    }
    calculateAbsolute() {
        this._absolute = new Vector(this.scale.x * this.canvas.width + this._offset.x, this.scale.y * this.canvas.height + this._offset.y);
    }
    get absolute() {
        return this._absolute.copy();
    }
    get scale() {
        return this._scale.copy();
    }
    get offset() {
        return this._offset.copy();
    }
    addScale(v) {
        this._scale.add(v);
        this.calculateAbsolute();
    }
    subScale(v) {
        this._scale.sub(v);
        this.calculateAbsolute();
    }
    addOffset(v) {
        this._offset.add(v);
        this.calculateAbsolute();
    }
    subOffset(v) {
        this._offset.sub(v);
        this.calculateAbsolute();
    }
    lerp(u, alpha) {
        this._scale.lerp(u._scale, alpha);
        this._offset.lerp(u._offset, alpha);
        this.calculateAbsolute();
    }
}
class Vector {
    constructor(x = 0, y = 0) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    static fromAngle(theta, magnitude = 1) {
        return new Vector(Math.cos(theta) * magnitude, Math.sin(theta) * magnitude);
    }
    static random() {
        return Vector.fromAngle(Math.random(), 1);
    }
    copy() {
        return new Vector(this._x, this._y);
    }
    set(x, y) {
        this._x = x;
        this._y = y;
        return this;
    }
    get angle() {
        return Math.atan2(this._y, this._x);
    }
    set angle(radians) {
        const radius = this.magnitude;
        this._x = radius * Math.cos(radians);
        this._y = radius * Math.sin(radians);
    }
    get magnitude() {
        return Math.sqrt(this.magnitudeSq);
    }
    set magnitude(length) {
        const n = this.normalize();
        const result = n.mul(length);
        this._x = result._x;
        this._y = result._y;
    }
    get magnitudeSq() {
        return this._x * this._x + this._y * this._y;
    }
    normalize() {
        const m = this.magnitude;
        if (m !== 0) {
            this._x /= m;
            this._y /= m;
        }
        else {
            this._x = 0;
            this._y = 0;
        }
        return this;
    }
    add(v) {
        if (v instanceof Vector) {
            this._x += v._x;
            this._y += v._y;
        }
        else {
            this._x += v;
            this._y += v;
        }
        return this;
    }
    sub(v) {
        if (v instanceof Vector) {
            this._x -= v._x;
            this._y -= v._y;
        }
        else {
            this._x -= v;
            this._y -= v;
        }
        return this;
    }
    mul(v) {
        if (v instanceof Vector) {
            this._x *= v._x;
            this._y *= v._y;
        }
        else {
            this._x *= v;
            this._y *= v;
        }
        return this;
    }
    div(v) {
        if (v instanceof Vector) {
            if (v._x === 0 || v._y === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            this._x /= v._x;
            this._y /= v._y;
        }
        else {
            if (v === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            this._x /= v;
            this._y /= v;
        }
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    angleBetween(v) {
        const squareSum = this.magnitudeSq * v.magnitudeSq;
        return Math.acos((this.dot(v) * Math.sqrt(squareSum)) / squareSum);
    }
    rotate(radians) {
        this.angle += radians;
    }
    lerp(target, alpha) {
        this._x = this._x * (1 - alpha) + target._x * alpha;
        this._y = this._y * (1 - alpha) + target._y * alpha;
        return this;
    }
    distance(v) {
        return Vector.sub(this, v).magnitude;
    }
    equals(v) {
        return this.x === v.x && this.y === v.y;
    }
    toString() {
        return `X: ${this._x} Y: ${this._y}`;
    }
    static normalize(v) {
        return this.fromAngle(v.angle, 1);
    }
    static add(a, b) {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x + b._x, a._y + b._y);
            }
            return new Vector(a._x + b, a._y + b);
        }
        else if (b instanceof Vector) {
            return new Vector(a + b._x, a + b._y);
        }
        return new Vector(a + b, a + b);
    }
    static sub(a, b) {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x - b._x, a._y - b._y);
            }
            return new Vector(a._x - b, a._y - b);
        }
        else if (b instanceof Vector) {
            return new Vector(a - b._x, a - b._y);
        }
        return new Vector(a - b, a - b);
    }
    static mul(a, b) {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x * b._x, a._y * b._y);
            }
            return new Vector(a._x * b, a._y * b);
        }
        else if (b instanceof Vector) {
            return new Vector(a * b._x, a * b._y);
        }
        return new Vector(a * b, a * b);
    }
    static div(a, b) {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                if (b._x === 0 || b._y === 0) {
                    throw new Error(Vector.DIV_ZERO_WARNING);
                }
                return new Vector(a._x / b._x, a._y / b._y);
            }
            if (b === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            return new Vector(a._x / b, a._y / b);
        }
        else if (b instanceof Vector) {
            if (b._x === 0 || b._y === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            return new Vector(a / b._x, a / b._y);
        }
        if (b === 0) {
            throw new Error(Vector.DIV_ZERO_WARNING);
        }
        return new Vector(a / b, a / b);
    }
    static lerp(current, target, alpha) {
        return new Vector(current._x * (1 - alpha) + target._x * alpha, current._y * (1 - alpha) + target._y * alpha);
    }
    static rotate(v, radians) {
        return Vector.fromAngle(v.angle + radians, v.magnitude);
    }
}
Vector.DIV_ZERO_WARNING = "Cannot divide by zero.";
window.addEventListener('load', () => {
    const game = new Game(document.getElementById('canvas'));
});
class Ellipse extends GuiObject {
    constructor(canvas, settings) {
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
    calculateAbsolutePosition() {
        return Vector.sub(this.position.absolute, Vector.mul(this.anchorPoint, this.size.absolute));
    }
    draw() {
        this.ctx.save();
        const actualPosition = this.calculateAbsolutePosition();
        const actualSize = this.size.absolute;
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
class Frame extends GuiObject {
    constructor(canvas, settings) {
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
    calculateAbsolutePosition() {
        return Vector.sub(this.position.absolute, Vector.mul(this.anchorPoint, this.size.absolute));
    }
    draw() {
        this.ctx.save();
        const actualPosition = this.calculateAbsolutePosition();
        const actualSize = this.size.absolute;
        this.ctx.fillStyle = this.background.toString();
        this.ctx.strokeStyle = this.borderColor.toString();
        this.ctx.lineWidth = this.borderSize;
        if (this.rotation !== 0) {
            const center = Vector.add(actualPosition, Vector.mul(actualSize, 0.5));
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
class KeyListener {
    constructor() {
        this.keyCodeStates = new Array();
        this.keyCodeTyped = new Array();
        this.previousState = new Array();
        window.addEventListener("keydown", (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        });
        window.addEventListener("keyup", (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        });
    }
    onFrameStart() {
        this.keyCodeTyped = new Array();
        this.keyCodeStates.forEach((val, key) => {
            if (this.previousState[key] != val && !this.keyCodeStates[key]) {
                this.keyCodeTyped[key] = true;
                this.previousState[key] = val;
            }
        });
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] == true;
    }
    isKeyTyped(keyCode) {
        return this.keyCodeTyped[keyCode] == true;
    }
}
KeyListener.KEY_ENTER = 13;
KeyListener.KEY_SHIFT = 16;
KeyListener.KEY_CTRL = 17;
KeyListener.KEY_ALT = 18;
KeyListener.KEY_ESC = 27;
KeyListener.KEY_SPACE = 32;
KeyListener.KEY_LEFT = 37;
KeyListener.KEY_UP = 38;
KeyListener.KEY_RIGHT = 39;
KeyListener.KEY_DOWN = 40;
KeyListener.KEY_DEL = 46;
KeyListener.KEY_1 = 49;
KeyListener.KEY_2 = 50;
KeyListener.KEY_3 = 51;
KeyListener.KEY_4 = 52;
KeyListener.KEY_5 = 53;
KeyListener.KEY_6 = 54;
KeyListener.KEY_7 = 55;
KeyListener.KEY_8 = 56;
KeyListener.KEY_9 = 57;
KeyListener.KEY_0 = 58;
KeyListener.KEY_A = 65;
KeyListener.KEY_B = 66;
KeyListener.KEY_C = 67;
KeyListener.KEY_D = 68;
KeyListener.KEY_E = 69;
KeyListener.KEY_F = 70;
KeyListener.KEY_G = 71;
KeyListener.KEY_H = 72;
KeyListener.KEY_I = 73;
KeyListener.KEY_J = 74;
KeyListener.KEY_K = 75;
KeyListener.KEY_L = 76;
KeyListener.KEY_M = 77;
KeyListener.KEY_N = 78;
KeyListener.KEY_O = 79;
KeyListener.KEY_P = 80;
KeyListener.KEY_Q = 81;
KeyListener.KEY_R = 82;
KeyListener.KEY_S = 83;
KeyListener.KEY_T = 84;
KeyListener.KEY_U = 85;
KeyListener.KEY_V = 86;
KeyListener.KEY_W = 87;
KeyListener.KEY_X = 88;
KeyListener.KEY_Y = 89;
KeyListener.KEY_Z = 90;
//# sourceMappingURL=app.js.map