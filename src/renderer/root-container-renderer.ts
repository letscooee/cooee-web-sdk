import {Constants} from '../constants';
import {Renderer} from './renderer';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer {

    private readonly renderer = new Renderer();

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    render(): HTMLElement {
        this.removeInApp();

        const rootDiv = this.renderer.createElement('div') as HTMLDivElement;
        rootDiv.id = Constants.IN_APP_CONTAINER_NAME;
        rootDiv.classList.add(Constants.IN_APP_CONTAINER_NAME);

        this.renderer.setStyle(rootDiv, 'z-index', '10000000');
        this.renderer.setStyle(rootDiv, 'position', 'fixed');
        this.renderer.setStyle(rootDiv, 'top', '0');
        this.renderer.setStyle(rootDiv, 'left', '0');
        this.renderer.setStyle(rootDiv, 'width', '100%');
        this.renderer.setStyle(rootDiv, 'height', '100%');

        this.renderer.appendChild(document.body, rootDiv);

        return rootDiv;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Remove InApp trigger.
     */
    removeInApp(): void {
        const rootDiv = document.getElementById(Constants.IN_APP_CONTAINER_NAME) as HTMLDivElement;
        if (rootDiv) {
            rootDiv.parentElement!.removeChild(rootDiv);
        }
    }

}
