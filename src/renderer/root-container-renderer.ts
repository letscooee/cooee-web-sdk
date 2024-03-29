import {Constants} from '../constants';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {TriggerContext} from '../models/trigger/trigger-context';
import {BlockProcessor} from './block-processor';

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

        this.insertElement();
        this.processCommonBlocks();
        this.inappHTMLEl.classList.add(Constants.IN_APP_WRAPPER_NAME);
        this.inappHTMLEl.classList.add(this.triggerContext.rootClassName);

        this.renderer.setStyle(this.inappHTMLEl, 'z-index', RootContainerRenderer.MAX_Z_INDEX);

        return this.inappHTMLEl;
    }

    protected override processBackgroundBlock(): void {
        // Do not process background if the in-app is not covering
        if (this.inappElement.cover) {
            super.processBackgroundBlock();
        }
    }

    protected override processWidthAndHeight(): void {
        const container = this.inappElement.cont;

        if (this.inappElement.cover) {
            if (this.renderer.isParentNotBody()) {
                this.renderer.setStyle(this.inappHTMLEl, 'width', '100%');
                this.renderer.setStyle(this.inappHTMLEl, 'height', '100%');
            } else {
                this.renderer.setStyle(this.inappHTMLEl, 'width', '100vw');
                this.renderer.setStyle(this.inappHTMLEl, 'height', '100vh');
            }

            this.renderer.setStyle(this.inappHTMLEl, 'top', '0');
            this.renderer.setStyle(this.inappHTMLEl, 'left', '0');
        } else {
            const spc = this.inappElement.spc;
            const containerCalculatedWidth = this.getScaledSize(container.w) + spc.getHorizontal();
            const containerCalculatedHeight = this.getScaledSize(container.h) + spc.getVertical();

            this.renderer.setStyle(this.inappHTMLEl, 'width', containerCalculatedWidth + 'px');
            this.renderer.setStyle(this.inappHTMLEl, 'height', containerCalculatedHeight + 'px');
        }
    }

    /**
     * Overriding this method to prevent scaling factor calculation.
     * @protected
     */
    protected override processSpaceBlock(): void {
        const spacing = this.inappElement.spc;
        this.renderer.setStyle(this.inappHTMLEl, 'padding', spacing.getPaddingCSS());
    }

    protected override processDisplay(): void {
        this.renderer.setStyle(this.inappHTMLEl, 'display', 'flex');
        Object.assign(this.inappHTMLEl.style, this.inappElement.getStylesForWrapper());
        // This is for the child i.e. container
        Object.assign(this.inappHTMLEl.style, this.inappElement.getFlexStylesForContainer());
    }

    protected override processPositionBlock(): void {
        if (this.renderer.isParentNotBody()) {
            if (this.triggerContext.triggerData.ian?.isEmbedded()) {
                this.renderer.setStyle(this.inappHTMLEl, 'position', 'block');
                return;
            }

            this.renderer.setStyle(this.inappHTMLEl, 'position', 'absolute');
        } else {
            this.renderer.setStyle(this.inappHTMLEl, 'position', 'fixed');
        }
    }

    protected override processBorderBlock(): void {
        return;
    }

    protected override processTransparency(): void {
        return;
    }

    protected override processTransformBlock(): void {
        return;
    }

    protected override processGradient(): void {
        return;
    }

    protected override processShadow(): void {
        return;
    }

    protected override registerAction(): void {
        this.inappHTMLEl.addEventListener('click', () => {
            new ClickActionExecutor({close: true}, this.triggerContext).execute();
        });
    }

}
