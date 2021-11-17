import {ShapeElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';

/**
 * Renders group element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ShapeRenderer extends BlockProcessor<ShapeElement> {

    constructor(parentElement: HTMLElement, inappElement: ShapeElement) {
        super(parentElement, inappElement);
        this.inappHTMLEl = this.renderer.createElement('div');
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     */
    render(): void {
        this.processCommonBlocks();
        this.renderer.appendChild(this.parentHTMLEl, this.inappHTMLEl);
    }

}
