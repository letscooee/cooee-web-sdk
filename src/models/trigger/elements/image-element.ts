import {BaseElement} from './base-element';

export class ImageElement extends BaseElement {

    src: string;

    constructor(data: Record<string, any>) {
        super(data);
        this.src = data.src;
    }

}
