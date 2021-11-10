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
     * Render group element from layers list in {@link InAppTrigger} block.
     * @param {HTMLElement} parent
     * @param {GroupElement} elementData style and attributes data of the group element
     * @return {HTMLElement} rendered group element
     */
    public render(parent: HTMLElement, elementData: GroupElement): HTMLElement {
        const newElement = this.renderer.createElement('div');
        // By default the parents will be relative
        this.renderer.setStyle(newElement, 'position', 'relative');

        elementData.size = elementData.size ?? {};
        elementData.size.display = 'FLEX';

        this.commonRenderingFunction(newElement, elementData);
        this.renderer.appendChild(parent, newElement);

        return newElement;
    }

}
