import {Color, Glossy, Image} from './';

export class Background {

    readonly s?: Color;
    readonly g?: Glossy;
    readonly i?: Image;

    constructor(data: Record<string, any>) {
        if (data.s) this.s = new Color(data.s);
        if (data.g) this.g = new Glossy(data.g);
        this.i = data.i;
    }

    get solid(): Color | undefined {
        return this.s;
    }

    get glossy(): Glossy | undefined {
        return this.g;
    }

    get img(): Image | undefined {
        return this.i;
    }

}
