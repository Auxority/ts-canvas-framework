class Color {
    private r: number;
    private g: number;
    private b: number;
    private a: number;

    //TODO: Fix bug where Hue is 360
    private constructor(red: number, green: number, blue: number, alpha: number) {
        this.r = Math.max(0, Math.min(255, red));
        this.g = Math.max(0, Math.min(255, green));
        this.b = Math.max(0, Math.min(255, blue));
        this.a = Math.max(0, Math.min(1, alpha));
    }

    public static random(): Color {
        return Color.fromHSL(Math.round(Math.random() * 360), Math.round(Math.random() * 100), Math.round(Math.random() * 100));
    }

    /**
     * Uses linear interpolation to change the current color into another color by a certain amount.
     * @param target Target color
     * @param alpha A number between 0 and 1 (0% -> 100%)
     */
    public lerp(target: Color, alpha: number): Color {
        const invertA: number = 1 - alpha;
        this.r = this.r * invertA + target.r * alpha
        this.g = this.g * invertA + target.g * alpha
        this.b = this.b * invertA + target.b * alpha
        this.a = this.a * invertA + target.b * alpha;
        return this;
    }

    /**
     * Uses linear interpolation to change the current color into another color by a certain amount.
     * @param current Current color
     * @param target Target color
     * @param alpha A number between 0 and 1 (0% -> 100%)
     */
    public static lerp(current: Color, target: Color, alpha: number): Color {
        const invertA: number = 1 - alpha;
        return Color.fromRGBa(
            current.r * invertA + target.r * alpha,
            current.g * invertA + target.g * alpha,
            current.b * invertA + target.b * alpha,
            current.a * invertA + target.a * alpha
        );
    }

    /**
     * Creates a new color from RGB color space.
     * @param red 0 - 255
     * @param green 0 - 255
     * @param blue 0 - 255
     * @param alpha 0 - 1
     */
    public static fromRGB(red: number, green: number, blue: number) {
        return this.fromRGBa(red, green, blue, 1);
    }

    /**
     * Creates a new color from RGBa color space.
     * @param red 0 - 255
     * @param green 0 - 255
     * @param blue 0 - 255
     * @param alpha 0 - 1
     */
    public static fromRGBa(red: number, green: number, blue: number, alpha: number) {
        return new Color(red, green, blue, alpha);
    }

    /**
     * Creates a new color from HSL color space.
     * @param hue 0 - 360
     * @param saturation 0 - 100
     * @param lightness 0 - 100
     * @param alpha 0 - 1
     */
    public static fromHSL(hue: number, saturation: number, lightness: number) {
        return this.fromHSLa(hue, saturation, lightness, 1);
    }

    /**
     * Creates a new color from HSLa color space.
     * @param hue 0 - 360
     * @param saturation 0 - 100
     * @param lightness 0 - 100
     * @param alpha 0 - 1
     */
    public static fromHSLa(hue: number, saturation: number, lightness: number, alpha: number) {
        saturation /= 100;
        lightness /= 100;
        const c: number = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x: number = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m: number = lightness - c / 2;
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;

        const smallHue: number = Math.floor(hue / 60);
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

    /**
     * Converts the color instance to a string when String(clr) or clr.toString() is called. 
     */
    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}