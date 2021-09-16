import {BlockRenderer} from './block-renderer';
import {ButtonElement} from '../models/trigger/elements';

/**
 * Renders button element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ButtonRenderer extends BlockRenderer {

    /**
     * Render button element from layers list in {@link ian} block.
     * @param {ButtonElement} elementData style and attributes data of the text element
     * @return {HTMLElement} rendered button
     * @private
     */
    public render(elementData: ButtonElement): HTMLElement {
        const newElement = this.blockProcessor.renderer.createElement('button');
        newElement.innerHTML = elementData.text;

        this.commonRenderingFunction(newElement, elementData);

        return newElement;
    }

}
