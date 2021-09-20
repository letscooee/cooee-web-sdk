import {Colour, Alignment, Font} from '../blocks';
import {BaseElement} from './base-element';

export interface BaseTextElement extends BaseElement {

    text: string;
    alignment: Alignment;
    font: Font;
    colour: Colour;

}
