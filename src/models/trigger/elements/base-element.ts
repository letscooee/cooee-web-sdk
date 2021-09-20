import {Background, Border, ClickAction, Overflow, Position, Shadow, Size, Spacing, Transform} from '../blocks';

export interface BaseElement {

    type: string;
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
