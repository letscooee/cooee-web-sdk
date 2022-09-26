import {Container} from '../models/trigger/inapp/container';
import {BlockProcessor} from './block-processor';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends BlockProcessor<Container> {

    readonly ian: InAppTrigger;

    constructor(parentElement: HTMLElement, inappElement: Container, ian: InAppTrigger) {
        super(parentElement, inappElement);
        this.inappHTMLEl = this.renderer.createElement('div');
        this.ian = ian;
        this.insertElement();
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     * @return The instance of this renderer.
     */
    render(): this {
        this.processCommonBlocks();
        this.renderer.setStyle(this.inappHTMLEl, 'position', 'relative');
        return this;
    }

}
