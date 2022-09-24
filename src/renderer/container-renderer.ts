import {Container} from '../models/trigger/inapp/container';
import {BlockProcessor} from './block-processor';
import {ContainerOrigin, InAppTrigger} from '../models/trigger/inapp/in-app-trigger';

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

    protected processWidthAndHeight(): void {
        super.processWidthAndHeight();

        /*
         * Changes the InApp div style to hide BG of InApp
         */
        if (this.ian.gvt !== ContainerOrigin.C) {
            this.renderer.setStyle(this.parentHTMLEl, 'width', this.getSizePx(this.inappElement.w));
            this.renderer.setStyle(this.parentHTMLEl, 'height', this.getSizePx(this.inappElement.h));
            this.renderer.setStyle(this.parentHTMLEl, 'top', 'unset');
            this.renderer.setStyle(this.parentHTMLEl, 'left', 'unset');
            this.renderer.setStyle(this.parentHTMLEl, 'margin', '20px');
            // eslint-disable-next-line guard-for-in
            Object.assign(this.parentHTMLEl.style, this.ian.getStyles());
        }
    }

}
