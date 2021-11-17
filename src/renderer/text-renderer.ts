import {BaseTextRenderer} from './base-text-renderer';
import {TextElement} from '../models/trigger/elements';
import {TextPart} from '../models/trigger/elements/text-element';

/**
 * Renders text element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class TextRenderer extends BaseTextRenderer {

    constructor(parentElement: HTMLElement, inappElement: TextElement) {
        super(parentElement, inappElement);
        this.inappHTMLEl = this.renderer.createElement('div');
    }

    /**
     * Render text element from layers list in {@link ian} block.
     */
    render(): void {
        this.inappElement.parts?.forEach((partData: TextPart) => {
            const newPartElement = this.renderer.createElement('span');
            newPartElement.innerHTML = partData.txt;
            this.processPart(newPartElement, partData);
            this.renderer.appendChild(this.inappHTMLEl, newPartElement);
        });

        this.processCommonBlocks();
        this.renderer.appendChild(this.parentHTMLEl, this.inappHTMLEl);
    }

}
