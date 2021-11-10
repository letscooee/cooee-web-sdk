import {Background, Border, ClickAction, Overflow, Position, Shadow, Size, Spacing, Transform} from '../blocks';

export interface BaseElement {

    type: ElementType;
    bg: Background;
    border: Border;
    click: ClickAction;
    overflow: Overflow;
    position: Position;
    shadow: Shadow;
    size: Size;
    spacing: Spacing;
    transform: Transform;

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
