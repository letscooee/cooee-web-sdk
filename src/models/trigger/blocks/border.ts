import {Color} from './color';

export class Border {

    readonly s: BorderStyle;
    readonly r?: number;
    readonly w?: number;
    readonly c?: Color;

    constructor(data: Record<string, any>) {
        this.s = data.s;
        this.r = data.r;
        this.w = data.w;
        if (data.c) {
            this.c = new Color(data.c);
        }
    }

    get radius(): number | undefined {
        return this.r;
    }

    get width(): number | undefined {
        return this.w;
    }

    get color(): Color | undefined {
        return this.c;
    }

    get style(): string {
        return BorderStyle[this.s ?? BorderStyle.SOLID];
    }

}

/* eslint-disable no-unused-vars */
export enum BorderStyle {

    SOLID = 1,
    DASHED = 2

}
/* eslint-enable no-unused-vars */
