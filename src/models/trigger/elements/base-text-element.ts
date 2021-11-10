import {Colour, Font} from '../blocks';
import {BaseElement} from './base-element';

export interface BaseTextElement extends BaseElement {

    text: string;
    alg: number;
    font: Font;
    clr: Colour;

}
