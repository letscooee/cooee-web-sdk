import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../models/trigger/elements/';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {TriggerData} from '../models/trigger/trigger-data';
import {TriggerHelper} from '../models/trigger/trigger-helper';
import {FontService} from '../services/font.service';
import {SafeHttpService} from '../services/safe-http-service';
import {Log} from '../utils/log';
import {ImageRenderer, RootContainerRenderer, ShapeRenderer, TextRenderer} from './';
import {ContainerRenderer} from './container-renderer';
import {Renderer} from './renderer';
import {TriggerContext} from '../models/trigger/trigger-context';

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
    private ian: InAppTrigger;

    /**
     * Public constructor.
     *
     * @param parent Place the in-app in the given parent instead of the document.body.
     */
    constructor(parent?: HTMLElement) {
        this.parent = parent ?? document.body;
        this.renderer.setParentContainer(this.parent);
    }

    /**
     * Renders in-app trigger from payload received
     * @param {TriggerData} triggerData {@link TriggerData}
     */
    render(triggerData: TriggerData): void {
        triggerData = new TriggerData(triggerData);

        const triggerContext = new TriggerContext(new Date(), triggerData);
        this.ian = triggerData.ian!;

        if (this.renderer.isMobile() || triggerData.previewType === 'mobile') {
            this.ian.overrideForMobileView();
        }

        this.renderer.calculateScalingFactor(this.ian);

        this.rootContainer = new RootContainerRenderer(this.parent, this.ian, triggerContext)
            .render() as HTMLDivElement;

        try {
            this.renderContainer(triggerContext);

            const event: Event = new Event(Constants.EVENT_TRIGGER_DISPLAYED, {}, triggerContext.triggerData);
            SafeHttpService.getInstance().sendEvent(event);

            TriggerHelper.storeActiveTrigger(triggerData);
        } catch (e) {
            Log.error(e);
        }
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

        const containerHTMLElement = new ContainerRenderer(this.rootContainer, container, triggerContext)
            .render()
            .getHTMLElement();

        // noinspection JSIgnoredPromiseFromCall
        new FontService().loadAllFonts(this.ian);

        this.ian.elems?.forEach(async (element: BaseElement) => {
            await this.renderElement(containerHTMLElement, element, triggerContext);
        });
    }

}
