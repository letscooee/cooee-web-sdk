import {BaseTextRenderer} from './base-text-renderer';
import {TextElement} from '../models/trigger/elements';

/**
 * Renders text element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class TextRenderer extends BaseTextRenderer {

    constructor() {
        super();
    }

    /**
     * Render text element from layers list in {@link ian} block.
     * @param {HTMLElement} parent
     * @param {TextElement} elementData style and attributes data of the text element
     * @return {HTMLDivElement} rendered text element in a {@link HTMLDivElement}
     */
    render(parent: HTMLElement, elementData: TextElement): HTMLDivElement {
        const newElement = this.renderer.createElement('div');

        if (elementData.parts) {
            elementData.parts.forEach((partData: TextElement) => {
                const newPartElement = this.renderer.createElement('span');
                newPartElement.innerHTML = partData.txt;
                this.processCommonBlocks(newPartElement, partData);
                this.renderer.appendChild(newElement, newPartElement);
            });
        } else {
            newElement.innerHTML = elementData.txt;
        }

        this.processCommonBlocks(newElement, elementData);
        this.renderer.appendChild(parent, newElement);

        return newElement as HTMLDivElement;
    }

}
