import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../models/trigger/elements/';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {TriggerData} from '../models/trigger/trigger-data';
import {TriggerHelper} from '../models/trigger/trigger-helper';
import {SafeHttpService} from '../services/safe-http-service';
import {LocalStorageHelper} from '../utils/local-storage-helper';
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
        this.ian = triggerData.ian!;

        this.rootContainer = new RootContainerRenderer(this.parent, this.ian)
            .render() as HTMLDivElement;

        try {
            this.renderContainer();

            const event: Event = new Event('CE Trigger Displayed', {'triggerID': triggerData.id});
            SafeHttpService.getInstance().sendEvent(event);

            LocalStorageHelper.setNumber(Constants.STORAGE_TRIGGER_START_TIME, new Date().getTime());
            TriggerHelper.storeActiveTrigger(triggerData);
        } catch (e) {
            Log.error(e);
        }
    }

    /**
     * Render elements.
     * @param {HTMLElement} parentEl element to be rendered
     * @param {BaseElement} inappElement style and attributes data of the element
     */
    private renderElement(parentEl: HTMLElement, inappElement: BaseElement): void {
        if (inappElement instanceof TextElement) {
            new TextRenderer(parentEl, inappElement).render();
        } else if (inappElement instanceof ImageElement) {
            new ImageRenderer(parentEl, inappElement).render();
        } else if (inappElement instanceof ShapeElement) {
            new ShapeRenderer(parentEl, inappElement).render();
        } else {
            Log.error('Unsupported element type- ' + inappElement.type);
        }
    }

    /**
     * Render container from {@link ian} block.
     * @private
     */
    private renderContainer(): void {
        const container = this.ian?.cont;
        if (!container) {
            return;
        }

        this.renderer.calculateScalingFactor(container.w, container.h);
        const containerHTMLElement = new ContainerRenderer(this.rootContainer, container)
            .render()
            .getHTMLElement();

        // Backward compatibility
        if (!this.ian.gvt) {
            this.ian.gvt = this.ian.cont.getOrigin();
        }
        Object.assign(containerHTMLElement.style, this.ian.getStyles());

        this.ian.elems?.forEach((element: BaseElement) => {
            this.renderElement(containerHTMLElement, element);
        });
    }

}
