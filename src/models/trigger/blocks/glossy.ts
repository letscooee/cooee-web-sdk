import {Color} from './color';

export class Glossy {

    readonly r: number;
    readonly c?: Color;

    constructor(data: Record<string, any>) {
        this.r = data.r;
        if (data.c) {
            this.c = new Color(data.c);
        }
    }

    get radius(): number {
        return this.r;
    }

    get color(): Color | undefined {
        return this.c;
    }

}
