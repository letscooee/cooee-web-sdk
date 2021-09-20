import {BlockRenderer} from './block-renderer';
import {BaseElement} from '../models/trigger/elements';

/**
 * Renders container present in in-app block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ContainerRenderer extends BlockRenderer {

    /**
     * Render container from {@link InAppTrigger} block.
     * @param {HTMLElement} parent
     * @param {BaseElement} elementData style and attributes data of the container.
     * @return {HTMLElement} parent
     * @private
     */
    public render(parent: HTMLElement, elementData: BaseElement): HTMLElement {
        this.commonRenderingFunction(parent, elementData);

        return parent;
    }

}
