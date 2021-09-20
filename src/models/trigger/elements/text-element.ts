import {BaseTextElement} from './base-text-element';

export interface TextElement extends BaseTextElement {

    parts: TextElement[];

}
