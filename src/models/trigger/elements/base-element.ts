import {Background, Border, ClickAction, Flex, Position, Shadow, Spacing, Transform} from '../blocks';

export interface BaseElement {

    type: ElementType;
    bg: Background;
    br: Border;
    click: ClickAction;
    clip: 'HIDDEN' | 'VISIBLE';
    pos: Position;
    shd: Shadow;
    spc: Spacing;
    trf: Transform;
    mode: 'FOLLOW_PARENT' | 'FREE_FLOATING';
    fx: Flex;

    w: number; // width
    h: number; // height
    x: number; // x-coordinate
    y: number; // y-coordinate
    z: number; // z-elevation

}

export enum ElementType {
    // TODO Why these are giving lint error no-unused-vars, even though they is used.
    // eslint-disable-next-line no-unused-vars
    TEXT = 'TEXT',
    // eslint-disable-next-line no-unused-vars
    IMAGE = 'IMAGE',
    // eslint-disable-next-line no-unused-vars
    GROUP = 'GROUP',
}
