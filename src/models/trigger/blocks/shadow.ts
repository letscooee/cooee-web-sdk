import {Color} from './color';

export class Shadow {

    readonly blur: number;
    readonly spr: number;
    readonly clr: Color;
    readonly x: number;
    readonly y: number;

    constructor(data: Partial<Shadow>) {
        data = data ?? {};
        this.blur = data.blur ?? 0;
        this.spr = data.spr ?? 0;
        this.x = data.x ?? 0;
        this.y = data.y ?? 0;
        this.clr = new Color(data.clr as Record<string, any>);
    }

    getStyle(scalingFactor: number): string {
        return `${this.x * scalingFactor}px ${this.y * scalingFactor}px ` +
            `${this.blur * scalingFactor}px ${this.spr * scalingFactor}px ${this.clr.rgba}`;
    }

}
