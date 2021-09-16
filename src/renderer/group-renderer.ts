import {BlockRenderer} from './block-renderer';
import {GroupElement} from '../models/trigger/elements';

/**
 * Renders group element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class GroupRenderer extends BlockRenderer {

    /**
     * Render button element from layers list in {@link ian} block.
     * @param {GroupElement} elementData style and attributes data of the text element
     * @return {HTMLElement} rendered group element
     * @private
     */
    public render(elementData: GroupElement): HTMLElement {
        const newElement = this.blockProcessor.renderer.createElement('div');
        // By default the parents will be relative
        this.blockProcessor.renderer.setStyle(newElement, 'position', 'relative');

        // Enforcing size to be FLEX for GROUP (because Android has challenges in normal layouts)
        elementData.size = elementData.size ?? {};
        elementData.size.display = elementData.size.display ?? 'FLEX';

        this.commonRenderingFunction(newElement, elementData);

        return newElement;
    }

}
