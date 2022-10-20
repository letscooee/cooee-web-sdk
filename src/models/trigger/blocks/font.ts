import {FontFamily} from './font-family';

export class Font {

    readonly s: number; // font size
    readonly lh: number; // line height
    readonly fmly: FontFamily; // font-family

    constructor(data: Partial<Font>) {
        data = data ?? {};
        this.s = data.s as number;
        this.lh = data.lh as number;
        if (data.fmly) {
            this.fmly = new FontFamily(data.fmly);
        }
    }

    get family(): FontFamily {
        return this.fmly;
    }

}
