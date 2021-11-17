import {ShapeElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';

/**
 * Renders group element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ShapeRenderer extends BlockProcessor {

    constructor() {
        super();
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     * @param {HTMLElement} parent
     * @param {ShapeElement} elementData style and attributes data of the group element
     * @return {HTMLElement} rendered group element
     */
    render(parent: HTMLElement, elementData: ShapeElement): HTMLElement {
        const newElement = this.renderer.createElement('div');

        this.processCommonBlocks(newElement, elementData);
        this.renderer.appendChild(parent, newElement);

        return newElement;
    }

}
