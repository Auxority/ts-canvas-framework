class Vector {
    private _x: number;
    private _y: number;

    public static DIV_ZERO_WARNING: string = "Cannot divide by zero.";

    /**
     * Creates a new vector.
     * @param x x-component of the vector.
     * @param y y-component of the vector.
     */
    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    /**
     * Allows other code to read the x-value of the vector.
     */
    public get x(): number {
        return this._x;
    }

    /**
     * Allows other code to read the y-value of the vector.
     */
    public get y(): number {
        return this._y;
    }

    /**
     * Creates a new vector from an angle.
     * @param theta The angle of the vector in radians.
     * @param magnitude The length of the vector.
     */
    public static fromAngle(theta: number, magnitude: number = 1) {
        return new Vector(Math.cos(theta) * magnitude, Math.sin(theta) * magnitude);
    }

    /**
     * Creates a new random vector.
     */
    public static random() {
        return Vector.fromAngle(Math.random(), 1);
    }

    /**
     * Copies the vector.
     */
    public copy(): Vector {
        return new Vector(this._x, this._y);
    }

    /**
     * Sets the vector components directly.
     * @param x x-component of the vector.
     * @param y y-component of the vector.
     */
    public set(x: number, y: number): Vector {
        this._x = x;
        this._y = y;
        return this;
    }

    /**
     * Calculates the angle of the vector.
     */
    public get angle(): number {
        return Math.atan2(this._y, this._x);
    }

    /**
     * Sets the x- and y-component of the vector based on the angle.
     */
    public set angle(radians: number) {
        const radius: number = this.magnitude;
        this._x = radius * Math.cos(radians);
        this._y = radius * Math.sin(radians);
    }

    /**
     * Calculates the length of the current vector.
     */
    public get magnitude(): number {
        return Math.sqrt(this.magnitudeSq);
    }

    /**
     * Sets the length of the current vector.
     */
    public set magnitude(length: number) {
        const n: Vector = this.normalize();
        const result: Vector = n.mul(length);
        this._x = result._x;
        this._y = result._y;
    }

    /**
     * Calculates the squared length of the vector.
    */    
    public get magnitudeSq(): number {
        return this._x * this._x + this._y * this._y;
    }

    /**
     * Normalizes the current vector.
     */
    public normalize(): Vector {
        const m: number = this.magnitude;
        if (m !== 0) {
            this._x /= m;
            this._y /= m;
        } else {
            this._x = 0;
            this._y = 0;
        }
        return this;
    }

    /**
     * Adds a vector or number to the vector.
     * @param v Vector or number
     */
    public add(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this._x += v._x;
            this._y += v._y;
        } else {
            this._x += v;
            this._y += v;
        }
        return this;
    }

    /**
     * Subtracts a vector or number from the vector.
     */
    public sub(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this._x -= v._x;
            this._y -= v._y;
        } else {
            this._x -= v;
            this._y -= v;
        }
        return this;
    }

    /**
     * Multiplies the vector with another vector or number.
     */
    public mul(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this._x *= v._x;
            this._y *= v._y;
        } else {
            this._x *= v;
            this._y *= v;
        }
        return this;
    }

    /**
     * Divides the vector by another vector or number.
     */
    public div(v: Vector | number): Vector {
        if (v instanceof Vector) {
            if (v._x === 0 || v._y === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            this._x /= v._x;
            this._y /= v._y;
        } else {
            if (v === 0) {
                throw new Error(Vector.DIV_ZERO_WARNING);
            }
            this._x /= v;
            this._y /= v;
        }
        return this;
    }

    /**
     * Calculates the dot product of two vectors.
     * @returns The dot product.
     */
    public dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Calculates the cross product of two vectors.
     * @returns The cross product.
     */
    public cross(v: Vector): number {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * Calculates the angle between two vectors.
     * @returns The angle in radians
     */
    public angleBetween(v: Vector): number {
        const squareSum = this.magnitudeSq * v.magnitudeSq;
        return Math.acos((this.dot(v) * Math.sqrt(squareSum)) / squareSum);
    }

    /**
     * Rotates the vector by a certain angle.
     * @param radians The angle in radians.
     */
    public rotate(radians: number): void {
        this.angle += radians;
    }

    /**
     * Uses linear interpolation to change the current vector into another vector by a certain amount.
     * @param target The vector to lerp towards.
     * @param alpha A number between 0 and 1 (0% -> 100%)
     */
    public lerp(target: Vector, alpha: number): Vector {
        this._x = this._x * (1 - alpha) + target._x * alpha;
        this._y = this._y * (1 - alpha) + target._y * alpha;
        return this;
    }

    /**
     * Calculates the distance between two vectors.
     * @returns Euclidian distance between two vectors.
     */
    public distance(v: Vector): number {
        return Vector.sub(this, v).magnitude;
    }

    /**
     * Checks if two vectors are equal.
     */
    public equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y;
    }

    /**
     * When String() or .toString() is called on the vector, the vector is converted to a string.
     */
    public toString(): string {
        return `X: ${this._x} Y: ${this._y}`;
    }

    // Static methods
    // These do not modify the vector itself but create a new Vector instance instead.

    /**
     * Normalizes a vector.
     */
    public static normalize(v: Vector): Vector {
        return this.fromAngle(v.angle, 1);
    }

    /**
     * Adds two vectors.
     */
    public static add(a: Vector | number, b: Vector | number): Vector {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x + b._x, a._y + b._y);
            }
            return new Vector(a._x + b, a._y + b);
        } else if (b instanceof Vector) {
            return new Vector(a + b._x, a + b._y);
        }
        return new Vector(a + b, a + b);
    }

    /**
     * Subtracts two vectors.
     */
    public static sub(a: Vector | number, b: Vector | number): Vector {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x - b._x, a._y - b._y);
            }
            return new Vector(a._x - b, a._y - b);
        } else if (b instanceof Vector) {
            return new Vector(a - b._x, a - b._y);
        }
        return new Vector(a - b, a - b);
    }

    /**
     * Multiplies two vectors.
     */
    public static mul(a: Vector | number, b: Vector | number): Vector {
        if (a instanceof Vector) {
            if (b instanceof Vector) {
                return new Vector(a._x * b._x, a._y * b._y);
            }
            return new Vector(a._x * b, a._y * b);
        } else if (b instanceof Vector) {
            return new Vector(a * b._x, a * b._y);
        }
        return new Vector(a * b, a * b);
    }

    /**
     * Divides two vectors.
     */
    public static div(a: Vector | number, b: Vector | number): Vector {
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
        } else if (b instanceof Vector) {
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

    /**
     * Uses linear interpolation to change the current vector into another vector by a certain amount.
     * @param alpha A number between 0 and 1 (0% -> 100%)
     */
    public static lerp(current: Vector, target: Vector, alpha: number): Vector {
        return new Vector(current._x * (1 - alpha) + target._x * alpha, current._y * (1 - alpha) + target._y * alpha);
    }

    /**
     * Rotates a vector.
     * @param v The vector to rotate.
     * @param radians The angle, in radians, to rotate the vector by.
     */
    public static rotate(v: Vector, radians: number): Vector {
        return Vector.fromAngle(v.angle + radians, v.magnitude);
    }
}