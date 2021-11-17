import {BaseTextElement} from './base-text-element';

export class TextElement extends BaseTextElement {

    prs: TextElement[];

    constructor(data: Record<string, any>) {
        super(data);
        this.prs = data.prs;
    }

    get parts(): TextElement[] {
        return this.prs;
    }

}
