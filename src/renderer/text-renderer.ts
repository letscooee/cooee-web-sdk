import {BlockRenderer} from './block-renderer';
import {TextElement} from '../models/trigger/elements';

/**
 * Renders text element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class TextRenderer extends BlockRenderer {

    /**
     * Render text element from layers list in {@link ian} block.
     * @param {TextElement} elementData style and attributes data of the text element
     * @return {HTMLDivElement} rendered text element in a {@link HTMLDivElement}
     * @private
     */
    public render(elementData: TextElement): HTMLDivElement {
        const newElement = this.blockProcessor.renderer.createElement('div');
        this.blockProcessor.processCommonBlocks(newElement, elementData);

        if (elementData.parts) {
            elementData.parts.forEach((partData: TextElement) => {
                const newPartElement = this.blockProcessor.renderer.createElement('span');
                newPartElement.innerHTML = partData.text;
                this.blockProcessor.processCommonBlocks(newPartElement, partData);
                this.blockProcessor.renderer.appendChild(newElement, newPartElement);
            });
        } else {
            newElement.innerHTML = elementData.text;
        }

        this.commonRenderingFunction(newElement, elementData);

        return newElement as HTMLDivElement;
    }

}
