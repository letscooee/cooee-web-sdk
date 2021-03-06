import {Color} from './color';

export class Glossy {

    // Default fallback color is black(#000000) with alpha 50%
    private static readonly DEFAULT_FALLBACK = new Color({h: '#000000', a: 50});

    readonly r: number;
    readonly c?: Color;
    readonly fb?: Color;

    constructor(data: Record<string, any>) {
        this.r = data.r;
        if (data.c) {
            this.c = new Color(data.c);
        }
        if (data.fb) {
            this.fb = new Color(data.fb);
        }
    }

    get radius(): number {
        return this.r;
    }

    get color(): Color | undefined {
        return this.c;
    }

    get fallback(): Color | undefined {
        return this.fb ?? Glossy.DEFAULT_FALLBACK;
    }

}
