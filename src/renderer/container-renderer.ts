import {ShapeElement} from '../models/trigger/elements';
import {ShapeRenderer} from './shape-renderer';
import {Container} from '../models/trigger/inapp/container';

/**
 * Renders container element.
 *
 * @author Shashank Agrawal
 * @version 0.0.5
 */
export class ContainerRenderer extends ShapeRenderer {

    constructor() {
        super();
    }

    /**
     * Render group element from layers list in {@link InAppTrigger} block.
     * @param {HTMLElement} parent
     * @param {ShapeElement} elementData style and attributes data of the group element
     * @return {HTMLElement} rendered group element
     */
    public render(parent: HTMLElement, elementData: Container): HTMLElement {
        const newElement = super.render(parent, elementData);
        this.renderer.setStyle(newElement, 'position', 'relative');
        this.renderer.setStyle(newElement, 'width', '100%');
        this.renderer.setStyle(newElement, 'height', '100%');

        return newElement;
    }

}
