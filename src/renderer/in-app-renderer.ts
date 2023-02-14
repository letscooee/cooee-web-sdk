import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {Animation} from '../models/trigger/blocks/Animation';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../models/trigger/elements/';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {TriggerContext} from '../models/trigger/trigger-context';
import {TriggerData} from '../models/trigger/trigger-data';
import {FontService} from '../services/font.service';
import {SafeHttpService} from '../services/safe-http-service';
import {Log} from '../utils/log';
import {ImageRenderer, RootContainerRenderer, ShapeRenderer, TextRenderer} from './';
import {ContainerRenderer} from './container-renderer';
import {Renderer} from './renderer';

/**
 * Renders In App trigger
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppRenderer {

    private readonly renderer: Renderer = Renderer.get();
    private readonly parent: HTMLElement;
    private rootContainer: HTMLDivElement;
    private containerHTMLElement: HTMLElement;
    private ian: InAppTrigger;
    private triggerContext: TriggerContext;
    private safeHTTP: SafeHttpService;

    /**
     * This is private variable to make event listener unique for multiple in-apps.
     *
     * @private
     */
    private readonly resizeListener: EventListener;

    /**
     * Public constructor.
     *
     * @param parent Place the in-app in the given parent instead of the document.body.
     */
    constructor(parent?: HTMLElement) {
        this.parent = parent ?? document.body;
        this.renderer.setParentContainer(this.parent);
        this.safeHTTP = SafeHttpService.getInstance();
        this.resizeListener = () => this.screenResized();
    }

    /**
     * Renders in-app trigger from payload received
     * @param {TriggerData} triggerData {@link TriggerData}
     */
    render(triggerData: TriggerData): void {
        triggerData = new TriggerData(triggerData);

        this.triggerContext = new TriggerContext(new Date(), triggerData);
        this.triggerContext.onClose((eventProps: Record<string, any>) => {
            this.closeInApp(eventProps);
        });

        this.ian = triggerData.ian!;

        if (this.renderer.isMobile() || triggerData.previewType === 'mobile') {
            this.ian.overrideForMobileView();
        }

        if (triggerData.shouldDelay()) {
            window.setTimeout(() => {
                this.startRenderingOnce();
            }, triggerData.getDelaySeconds());
        } else {
            this.startRenderingOnce();
        }
    }

    /**
     * Start rendering the in-app and register the window resize event.
     *
     * @private
     */
    private startRenderingOnce(): void {
        try {
            this.startRendering();
        } catch (e) {
            return;
        }

        this.sendTriggerDisplayed();
        window.addEventListener('resize', this.resizeListener);
    }

    /**
     * Calculate scaling factor and start rending of the InApp. This method may be called multiple times if the
     * window screen is resized.
     *
     * @private
     */
    private startRendering(): void {
        this.renderer.calculateScalingFactor(this.ian);

        this.rootContainer = new RootContainerRenderer(this.parent, this.ian, this.triggerContext)
            .render() as HTMLDivElement;

        try {
            this.renderContainer(this.triggerContext);
        } catch (e) {
            Log.error(e);
            throw e;
        }
    }

    private sendTriggerDisplayed(): void {
        const event: Event = new Event(Constants.EVENT_TRIGGER_DISPLAYED, {}, this.triggerContext.triggerData);
        this.safeHTTP.sendEvent(event);
    }

    private sendTriggerClosed(eventProps: Record<string, any>): void {
        const event = new Event(Constants.EVENT_TRIGGER_CLOSED, eventProps, this.triggerContext.triggerData);
        this.safeHTTP.sendEvent(event);
    }

    private addEnterAnimation(anim: Animation): void {
        this.containerHTMLElement.animate(anim.getEnterAnimation(), {duration: 500});
    }

    /**
     * Render elements.
     * @param {HTMLElement} parentEl element to be rendered
     * @param {BaseElement} inappElement style and attributes data of the element
     * @param triggerContext
     */
    private renderElement(parentEl: HTMLElement, inappElement: BaseElement, triggerContext: TriggerContext): void {
        if (inappElement instanceof TextElement) {
            new TextRenderer(parentEl, inappElement, triggerContext).render();
        } else if (inappElement instanceof ImageElement) {
            new ImageRenderer(parentEl, inappElement, triggerContext).render();
        } else if (inappElement instanceof ShapeElement) {
            new ShapeRenderer(parentEl, inappElement, triggerContext).render();
        } else {
            Log.error('Unsupported element type- ' + inappElement.type);
        }
    }

    /**
     * Render container from {@link ian} block.
     * @param triggerContext
     * @private
     */
    private renderContainer(triggerContext: TriggerContext): void {
        const container = this.ian?.cont;
        if (!container) {
            return;
        }

        this.containerHTMLElement = new ContainerRenderer(this.rootContainer, container, triggerContext)
            .render()
            .getHTMLElement();

        // noinspection JSIgnoredPromiseFromCall
        new FontService().loadAllFonts(this.ian);

        this.ian.elems?.forEach(async (element: BaseElement) => {
            await this.renderElement(this.containerHTMLElement, element, triggerContext);
        });

        this.addEnterAnimation(this.ian.anim);
    }

    /**
     * Close InApp
     * @param eventProps event props sent by the close callback
     * @private
     */
    private closeInApp(eventProps: Record<string, any>): void {
        const closeAnimation = this.ian.anim.getExitAnimation();

        const animation = this.containerHTMLElement.animate(closeAnimation, {duration: 500, easing: 'ease-in-out'});
        animation.onfinish = () => {
            this.removeInApp();
            this.sendTriggerClosed(eventProps);

            /**
             * Removes event listener only for this instance of the InApp
             */
            window.removeEventListener('resize', this.resizeListener);
        };
    }

    /**
     * Called when window gets resized.
     * <p>This function removes currently displaying InApp and re-render same InApp without sending an event
     * @private
     */
    private screenResized(): void {
        this.removeInApp();
        this.startRendering();
    }

    /**
     * Removes currently displaying trigger from UI
     * @private
     */
    private removeInApp(): void {
        Renderer.get().removeInApp(this.triggerContext);
    }

}
