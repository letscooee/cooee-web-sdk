import {BlockProcessor} from './block-processor';
import {BaseElement} from '../models/trigger/elements';

/**
 * Base class for rendering any block from in-app.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockRenderer extends BlockProcessor {

    /**
     * Public constructor
     */
    constructor() {
        super();
    }

    abstract render(parent: HTMLElement, element: BaseElement | string | null): HTMLElement;

    /**
     * Process all the common block in in-app.
     * @param {HTMLElement} el element to be processed
     * @param {BaseElement} baseElement style and attributes data of the element
     */
    protected commonRenderingFunction(el: HTMLElement, baseElement: BaseElement): void {
        this.processCommonBlocks(el, baseElement);

        if (baseElement.type) {
            el.classList.add(baseElement.type);
        }
    }

}
