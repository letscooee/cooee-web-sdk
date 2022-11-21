import {ShapeElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Renders group element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ShapeRenderer extends BlockProcessor<ShapeElement> {

    constructor(parentElement: HTMLElement, inappElement: ShapeElement, triggerContext: TriggerContext) {
        super(parentElement, inappElement, triggerContext);
        this.inappHTMLEl = this.renderer.createElement('div');
        this.insertElement();
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     */
    render(): void {
        this.processCommonBlocks();
    }

}
