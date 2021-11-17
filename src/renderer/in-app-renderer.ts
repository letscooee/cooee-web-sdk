import {Log} from '../utils/log';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../models/trigger/elements/';
import {TriggerData} from '../models/trigger/trigger-data';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';
import {ImageRenderer, RootContainerRenderer, ShapeRenderer, TextRenderer} from './';
import {ContainerRenderer} from './container-renderer';

/**
 * Renders In App trigger
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppRenderer {

    private readonly rootContainer: HTMLDivElement;
    private ian: InAppTrigger;

    /**
     * Public constructor
     */
    constructor() {
        this.rootContainer = new RootContainerRenderer().render() as HTMLDivElement;
    }

    /**
     * Renders in-app trigger from payload received
     * @param {TriggerData} triggerData {@link TriggerData}
     */
    render(triggerData: TriggerData): void {
        triggerData = new TriggerData(triggerData);
        this.ian = triggerData.ian!;

        try {
            this.renderContainer();
            LocalStorageHelper.setNumber(Constants.STORAGE_TRIGGER_START_TIME, new Date().getTime());
            LocalStorageHelper.setString(Constants.STORAGE_ACTIVE_TRIGGER_ID, triggerData.id);
        } catch (e) {
            Log.e(e);
        }
    }

    /**
     * Render elements.
     * @param {HTMLElement} parentEl element to be rendered
     * @param {BaseElement} inappElement style and attributes data of the element
     * @return {HTMLElement} rendered element
     * @private
     */
    private renderElement(parentEl: HTMLElement, inappElement: BaseElement): HTMLElement {
        let newElement: HTMLElement;

        if (inappElement instanceof TextElement) {
            newElement = new TextRenderer().render(parentEl, inappElement);
        } else if (inappElement instanceof ImageElement) {
            newElement = new ImageRenderer().render(parentEl, inappElement);
        } else if (inappElement instanceof ShapeElement) {
            newElement = new ShapeRenderer().render(parentEl, inappElement);
        } else {
            Log.e('Unsupported element type- ' + inappElement.type);
        }

        // @ts-ignore
        return newElement;
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

        const containerHTMLElement = new ContainerRenderer().render(this.rootContainer, container);

        this.ian.elems?.forEach((element: BaseElement) => {
            this.renderElement(containerHTMLElement, element);
        });
    }

}
