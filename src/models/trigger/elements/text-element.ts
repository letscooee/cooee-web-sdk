import {Color, Font} from '../blocks';
import {BaseElement} from './base-element';

export class TextElement extends BaseElement {

    c: Color;
    f: Font;
    alg: TextAlign = TextAlign.START;
    prs: TextPart[];

    constructor(data: Record<string, any>) {
        super(data);
        this.prs = data.prs;
        this.alg = data.alg;
        if (data.f) this.f = data.f;
        if (data.c) this.c = new Color(data.c);
    }

    get parts(): TextPart[] {
        return this.prs;
    }

    get color(): Color {
        return this.c;
    }

    get font(): Font {
        return this.f;
    }

}

export class TextPart {

    txt: string;
    b: boolean;
    i: boolean;
    u: boolean;
    /**
     * Color in hex string
     */
    c: string;
    /**
     * Strike through or not
     */
    st: boolean;
    /**
     * Script type.
     */
    sc: TextScript;

    constructor(data: Record<string, any>) {
        this.txt = data.text;
        this.b = data.b;
        this.i = data.i;
        this.u = data.u;
        this.st = data.st;
        this.sc = data.sc;
    }

}

/* eslint-disable no-unused-vars */
export enum TextAlign { START, CENTER, END, JUSTIFY}

export enum TextScript { NORMAL, SUPER, SUB}
/* eslint-enable no-unused-vars */
