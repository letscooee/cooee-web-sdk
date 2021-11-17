import {ImageElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';

/**
 * Renders image element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ImageRenderer extends BlockProcessor {

    constructor() {
        super();
    }

    /**
     * Render image element from layers list in {@link ian} block.
     * @param {HTMLElement} parent
     * @param {ImageElement} elementData style and attributes data of the image element
     * @return {HTMLElement} rendered image element
     */
    public render(parent: HTMLElement, elementData: ImageElement): HTMLElement {
        const newElement = this.renderer.createElement('img');
        this.renderer.setAttribute(newElement, 'src', elementData.src);
        this.renderer.setStyle(newElement, 'max-width', '100%');
        this.renderer.setStyle(newElement, 'max-height', '100%');
        this.renderer.setStyle(newElement, 'display', 'block');
        this.renderer.setStyle(newElement, 'margin', '0 auto');

        this.processCommonBlocks(newElement, elementData);
        this.renderer.appendChild(parent, newElement);

        return newElement;
    }

}
