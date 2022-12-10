import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {BlockProcessor} from './block-processor';
import {TriggerContext} from '../models/trigger/trigger-context';
import {Constants} from '../constants';

/**
 * Renders root container.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class RootContainerRenderer extends BlockProcessor<InAppTrigger> {

    // https://stackoverflow.com/a/25461690/1775026
    private static readonly MAX_Z_INDEX = '2147483647';

    constructor(private parent: HTMLElement, inappElement: InAppTrigger, triggerContext: TriggerContext) {
        super(parent, inappElement, triggerContext);
        this.inappHTMLEl = this.renderer.createElement('div');
    }

    /**
     * Render root container.
     * @return {HTMLElement} rendered root container
     */
    render(): HTMLElement {
        if (!this.parent) {
            this.renderer.removeInApp(this.triggerContext);
        }

        this.inappHTMLEl.classList.add(Constants.IN_APP_WRAPPER_NAME);
        this.inappHTMLEl.classList.add(this.triggerContext.rootClassName);

        this.renderer.setStyle(this.inappHTMLEl, 'z-index', RootContainerRenderer.MAX_Z_INDEX);

        this.addProperties();

        this.insertElement();
        this.inappHTMLEl.addEventListener('click', () => {
            new ClickActionExecutor({close: true}, this.triggerContext).execute();
        });

        return this.inappHTMLEl;
    }

    /**
     * Applies style with respect to InApp gravity
     * @private
     */
    private addProperties(): void {
        const container = this.inappElement.cont;
        const cover = this.inappElement.cover;

        if (cover) {
            this.processBackgroundBlock();
            this.renderer.setStyle(this.inappHTMLEl, 'top', '0');
            this.renderer.setStyle(this.inappHTMLEl, 'left', '0');
            this.renderer.setStyle(this.inappHTMLEl, 'width', '100%');
            this.renderer.setStyle(this.inappHTMLEl, 'height', '100%');
        } else {
            this.renderer.setStyle(this.inappHTMLEl, 'width', this.getSizePx(container.w));
            this.renderer.setStyle(this.inappHTMLEl, 'height', this.getSizePx(container.h));

            Object.assign(this.inappHTMLEl.style, this.inappElement.getStyles());
        }

        if (this.parent !== document.body) {
            this.renderer.setStyle(this.inappHTMLEl, 'position', 'absolute');
        } else {
            this.renderer.setStyle(this.inappHTMLEl, 'position', 'fixed');
        }
    }

}
