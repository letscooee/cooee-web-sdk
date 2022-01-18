import {Container} from '../models/trigger/inapp/container';
import {BlockProcessor} from './block-processor';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends BlockProcessor<Container> {

    constructor(parentElement: HTMLElement, inappElement: Container) {
        super(parentElement, inappElement);
        this.inappHTMLEl = this.renderer.createElement('div');
        this.insertElement();
        // Need to figure out the best way of doing this
        this.inappElement.w = 1080;
        this.inappElement.h = 1920;
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     * @return The instance of this renderer.
     */
    render(): this {
        this.processCommonBlocks();
        this.renderer.setStyle(this.inappHTMLEl, 'position', 'relative');
        Object.assign(this.inappHTMLEl.style, this.inappElement.getStyles());
        return this;
    }

}
