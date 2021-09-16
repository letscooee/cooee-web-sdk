import {BlockRenderer} from './block-renderer';
import {BaseElement} from '../models/trigger/elements';

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
        const layerElement = this.blockProcessor.renderer.createElement('div');
        elementData.type = 'layer';

        // By default the parents will be relative
        this.blockProcessor.renderer.setStyle(layerElement, 'position', 'relative');
        this.blockProcessor.renderer.appendChild(parent, layerElement);

        // Enforcing size to be FLEX for layers (because Android has challenges in normal layouts)
        elementData.size = elementData.size ?? {};
        elementData.size.display = elementData.size.display ?? 'FLEX';

        this.commonRenderingFunction(layerElement, elementData);
        this.blockProcessor.renderer.appendChild(parent, layerElement);

        return layerElement;
    }

}
