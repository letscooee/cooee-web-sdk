import {Constants} from '../constants';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {BlockProcessor} from './block-processor';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer extends BlockProcessor<InAppTrigger> {

    constructor(private parent: HTMLElement, inappElement: InAppTrigger) {
        super(parent, inappElement);
        this.inappHTMLEl = this.renderer.createElement('div');
    }

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    render(): HTMLElement {
        if (!this.parent) {
            this.renderer.removeInApp();
        }

        this.processBackgroundBlock();
        this.inappHTMLEl.classList.add(Constants.IN_APP_CONTAINER_NAME);

        if (this.parent !== document.body) {
            this.renderer.setStyle(this.inappHTMLEl, 'position', 'absolute');
        } else {
            this.renderer.setStyle(this.inappHTMLEl, 'position', 'fixed');
        }

        this.renderer.setStyle(this.inappHTMLEl, 'z-index', '10000000');
        this.renderer.setStyle(this.inappHTMLEl, 'top', '0');
        this.renderer.setStyle(this.inappHTMLEl, 'left', '0');
        this.renderer.setStyle(this.inappHTMLEl, 'width', '100%');
        this.renderer.setStyle(this.inappHTMLEl, 'height', '100%');

        this.insertElement();
        this.inappHTMLEl.addEventListener('click', () => {
            new ClickActionExecutor({close: true}).execute();
        });

        return this.inappHTMLEl;
    }

}
