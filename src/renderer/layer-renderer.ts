import {BlockRenderer} from './block-renderer';
import {BaseElement} from '../models/trigger/elements';
import {Type} from '../models/trigger/elements/base-element';

/**
 * Render layer from in {@link InAppTrigger}
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class LayerRenderer extends BlockRenderer {

    /**
     * Render layer from in {@link InAppTrigger}
     * @param {HTMLElement} parent
     * @param {BaseElement} elementData style and attributes data of the layer
     * @return {HTMLElement} rendered layer in div tag
     */
    public render(parent: HTMLElement, elementData: BaseElement): HTMLElement {
        const layerElement = this.renderer.createElement('div');
        elementData.type = Type.LAYER;

        // By default the parents will be relative
        this.renderer.setStyle(layerElement, 'position', 'relative');
        this.renderer.appendChild(parent, layerElement);

        // Enforcing size to be FLEX for layers
        elementData.size = elementData.size ?? {};
        elementData.size.display = elementData.size.display ?? 'FLEX';

        this.commonRenderingFunction(layerElement, elementData);
        this.renderer.appendChild(parent, layerElement);

        return layerElement;
    }

}
