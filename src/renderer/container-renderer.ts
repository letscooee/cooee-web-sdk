import {ShapeRenderer} from './shape-renderer';
import {Container} from '../models/trigger/inapp/container';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends ShapeRenderer {

    constructor(parentElement: HTMLElement, inappElement: Container) {
        super(parentElement, inappElement);
        // Need to figure out the best way of doing this
        this.inappElement.w = 1080;
        this.inappElement.h = 1920;
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     */
    render(): this {
        super.render();
        this.renderer.setStyle(this.inappHTMLEl, 'position', 'relative');
        /*this.renderer.setStyle(this.inappHTMLEl, 'width', '100%');
        this.renderer.setStyle(this.inappHTMLEl, 'height', '100%');*/
        return this;
    }

}
