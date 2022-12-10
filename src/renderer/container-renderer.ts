import {Container} from '../models/trigger/inapp/container';
import {BlockProcessor} from './block-processor';
import {TriggerContext} from '../models/trigger/trigger-context';
import {Constants} from '../constants';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends BlockProcessor<Container> {

    constructor(parentElement: HTMLElement, inappElement: Container, triggerContext: TriggerContext) {
        super(parentElement, inappElement, triggerContext);
        this.inappHTMLEl = this.renderer.createElement('div');
        this.insertElement();
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     * @return The instance of this renderer.
     */
    render(): this {
        this.processCommonBlocks();
        this.renderer.setStyle(this.inappHTMLEl, 'position', 'relative');
        this.inappHTMLEl.classList.add(Constants.IN_APP_CONTAINER_NAME);
        return this;
    }

}
