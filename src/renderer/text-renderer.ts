import {BaseTextRenderer} from './base-text-renderer';
import {TextElement} from '../models/trigger/elements';
import {TextPart} from '../models/trigger/elements/text-element';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Renders text element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class TextRenderer extends BaseTextRenderer {

    constructor(parentElement: HTMLElement, inappElement: TextElement, triggerContext: TriggerContext) {
        super(parentElement, inappElement, triggerContext);
        this.inappHTMLEl = this.renderer.createElement('div');
        this.insertElement();
    }

    /**
     * Render text element from layers list in {@link ian} block.
     */
    render(): void {
        this.inappElement.parts?.forEach((partData: TextPart) => {
            const newPartElement = this.renderer.createElement('span');
            newPartElement.innerHTML = partData.txt?.toString()?.replace(/\n/g, '<br />');
            this.processPart(newPartElement, partData);
            this.renderer.appendChild(this.inappHTMLEl, newPartElement);
        });

        this.processCommonBlocks();
    }

}
