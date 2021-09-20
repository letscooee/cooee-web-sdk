import {BlockRenderer} from './block-renderer';

/**
 * Renders container present in in-app block.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer extends BlockRenderer {

    /**
     * Render root container.
     * @return {HTMLElement} rendered button
     */
    public render(): HTMLElement {
        return this.renderer.getRootContainer();
    }

}
