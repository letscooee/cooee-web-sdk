import {Color} from './color';

export class Shadow {

    readonly blur: number;
    readonly spr: number;
    readonly clr: Color;

    constructor(data: Partial<Shadow>) {
        data = data ?? {};
        this.blur = data.blur as number;
        this.spr = data.spr as number;
        this.clr = new Color(data.clr as Record<string, any>);
    }

    getStyle(scalingFactor: number): string {
        return `0px 0px ${this.blur * scalingFactor}px ${this.spr * scalingFactor}px ${this.clr.rgba}`;
    }

}
