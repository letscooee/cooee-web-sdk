import {Background, Border, ClickAction, Overflow, Position, Shadow, Size, Spacing, Transform} from '../blocks';

export interface BaseElement {

    type: Type;
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

export enum Type {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    BUTTON = 'BUTTON',
    GROUP = 'GROUP',
    LAYER = 'LAYER'
}
