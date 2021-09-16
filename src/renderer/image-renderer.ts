import {BlockRenderer} from './block-renderer';
import {ImageElement} from '../models/trigger/elements';

/**
 * Renders image element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ImageRenderer extends BlockRenderer {

    /**
     * Render image element from layers list in {@link ian} block.
     * @param {ImageElement} elementData style and attributes data of the text element
     * @return {HTMLElement} rendered image element
     * @private
     */
    public render(elementData: ImageElement): HTMLElement {
        const newElement = this.blockProcessor.renderer.createElement('img');
        this.blockProcessor.renderer.setAttribute(newElement, 'src', elementData.url);
        this.blockProcessor.renderer.setStyle(newElement, 'max-width', '100%');
        this.blockProcessor.renderer.setStyle(newElement, 'max-height', '100%');
        this.blockProcessor.renderer.setStyle(newElement, 'display', 'block');
        this.blockProcessor.renderer.setStyle(newElement, 'margin', '0 auto');

        this.commonRenderingFunction(newElement, elementData);

        return newElement;
    }

}
