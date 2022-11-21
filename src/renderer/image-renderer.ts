import {ImageElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Renders image element present in in-app layer block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ImageRenderer extends BlockProcessor<ImageElement> {

    constructor(parentElement: HTMLElement, inappElement: ImageElement, triggerContext: TriggerContext) {
        super(parentElement, inappElement, triggerContext);
        this.inappHTMLEl = this.renderer.createElement('img');
        this.insertElement();
    }

    /**
     * Render image element from layers list in {@link ian} block.
     */
    render(): void {
        this.renderer.setAttribute(this.inappHTMLEl, 'src', this.inappElement.src);
        this.renderer.setStyle(this.inappHTMLEl, 'max-width', 'none');
        this.renderer.setStyle(this.inappHTMLEl, 'max-height', 'none');
        this.renderer.setStyle(this.inappHTMLEl, 'margin', '0 auto');
        this.processCommonBlocks();
    }

}
