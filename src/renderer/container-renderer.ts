import {Container} from '../models/trigger/inapp/container';
import {BlockProcessor} from './block-processor';
import {TriggerData} from '../models/trigger/trigger-data';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends BlockProcessor<Container> {

    constructor(parentElement: HTMLElement, inappElement: Container, triggerData: TriggerData) {
        super(parentElement, inappElement, triggerData);
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
        return this;
    }

}
