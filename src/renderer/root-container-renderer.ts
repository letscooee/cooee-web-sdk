import {Constants} from '../constants';
import {Renderer} from './renderer';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer {

    private readonly renderer = Renderer.get();

    constructor(private parent?: HTMLElement) {
        this.renderer.setParentContainer(parent!);
    }

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    render(): HTMLElement {
        if (!this.parent) {
            this.removeInApp();
        }

        const rootDiv = this.renderer.createElement('div') as HTMLDivElement;
        rootDiv.classList.add(Constants.IN_APP_CONTAINER_NAME);

        if (this.parent) {
            this.renderer.setStyle(rootDiv, 'position', 'absolute');
        } else {
            this.renderer.setStyle(rootDiv, 'position', 'fixed');
        }

        this.renderer.setStyle(rootDiv, 'z-index', '10000000');
        this.renderer.setStyle(rootDiv, 'top', '0');
        this.renderer.setStyle(rootDiv, 'left', '0');
        this.renderer.setStyle(rootDiv, 'width', '100%');
        this.renderer.setStyle(rootDiv, 'height', '100%');

        this.renderer.appendChild(this.parent || document.body, rootDiv);
        rootDiv.addEventListener('click', () => {
            new ClickActionExecutor({close: true}).execute();
        });

        return rootDiv;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Remove InApp trigger.
     */
    removeInApp(): void {
        const rootDiv = document.querySelector(`.${Constants.IN_APP_CONTAINER_NAME}`) as HTMLDivElement;
        if (rootDiv) {
            rootDiv.parentElement!.removeChild(rootDiv);
        }
    }

}
