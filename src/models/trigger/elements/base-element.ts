import {Background, Border, ClickAction, Shadow, Spacing, Transform} from '../blocks';

export abstract class BaseElement {

    t: ElementType;
    bg?: Background;
    br: Border;
    clc: ClickAction;
    shd: Shadow;
    spc: Spacing;
    trf: Transform;
    a: number; // alpha/transparency

    w: number; // width
    h: number; // height
    x: number; // x-coordinate
    y: number; // y-coordinate

    protected constructor(data: Record<string, any>) {
        this.t = data.t;
        if (data.bg) this.bg = new Background(data.bg);
        if (data.br) this.br = new Border(data.br);
        if (data.shd) this.shd = new Shadow(data.shd);
        this.trf = new Transform(data.trf);
        this.clc = data.clc;
        this.spc = data.spc;
        this.w = data.w;
        this.h = data.h;
        this.x = data.x;
        this.y = data.y;
        this.a = data.a;
    }

    get alpha(): number {
        return this.a ?? 100;
    }

    get type(): ElementType {
        return this.t;
    }

    get typeAsString(): string {
        return ElementType[this.t];
    }

    get click(): ClickAction {
        return this.clc;
    }

}

/* eslint-disable no-unused-vars */
export enum ElementType {

    IMAGE = 1,
    TEXT = 2,
    BUTTON = 3,
    SHAPE = 100,

}

/* eslint-disable no-unused-vars */
