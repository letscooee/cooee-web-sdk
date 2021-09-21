import {BlockRenderer} from './block-renderer';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer extends BlockRenderer {

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    public render(): HTMLElement {
        return this.renderer.getRootContainer();
    }

}
