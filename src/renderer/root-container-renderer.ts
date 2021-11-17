import {BlockProcessor} from './block-processor';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer extends BlockProcessor {

    constructor() {
        super();
    }

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    public render(): HTMLElement {
        return this.renderer.getRootContainer();
    }

}
