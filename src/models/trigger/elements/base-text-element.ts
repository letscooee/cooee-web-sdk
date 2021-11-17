import {Color, Font} from '../blocks';
import {BaseElement} from './base-element';

export class BaseTextElement extends BaseElement {

    txt: string;
    alg: number;
    f: Font;
    c: Color;

    protected constructor(data: Record<string, any>) {
        super(data);
        this.txt = data.txt;
        this.alg = data.alg;
        if (data.f) this.f = data.f;
        if (data.c) this.c = new Color(data.c);
    }

    get color(): Color {
        return this.c;
    }

    get font(): Font {
        return this.f;
    }

}
