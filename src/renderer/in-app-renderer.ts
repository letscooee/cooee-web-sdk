import {Log} from '../utils/log';
import {InAppTrigger} from '../models/trigger/inapp/in-app-trigger';
import {Layer} from '../models/trigger/inapp/layer';
import {BaseElement, TextElement, ImageElement, GroupElement, ButtonElement} from '../models/trigger/elements/';
import {TextRenderer, ImageRenderer, ButtonRenderer, GroupRenderer} from './';
import {ContainerRenderer} from './container-renderer';
import {RootContainerRenderer} from './root-container-renderer';
import {LayerRenderer} from './layer-renderer';

/**
 * Renders In App trigger
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppRenderer {

    private readonly rootContainer: HTMLDivElement;
    private ian: InAppTrigger | undefined;

    /**
     * Public constructor
     */
    constructor() {
        this.rootContainer = new RootContainerRenderer().render() as HTMLDivElement;
    }

    /**
     * Renders in-app trigger from payload received
     * @param {InAppTrigger} ian in-app block from {@link TriggerData}
     */
    render(ian: InAppTrigger): void {
        this.ian = ian;

        try {
            this.startRendering();
        } catch (e) {
            Log.e(e);
        }
    }

    /**
     * Starts rendering in-app containers and layers
     * @private
     */
    private startRendering(): void {
        if (!this.ian) {
            return;
        }

        this.renderContainer();
        this.renderLayers();
    }

    /**
     * Render all the layers from {@link ian} block.
     * @private
     */
    private renderLayers(): void {
        this.ian?.layers?.forEach((layer: Layer, index: number) => {
            this.renderLayer(layer, index);
        });
    }

    /**
     * Render individual layer from layers list in {@link ian} block.
     * @param {Layer} layerData style and attributes data of the layer
     * @param {number} index
     * @private
     */
    private renderLayer(layerData: Layer, index: number): void {
        const layerElement = new LayerRenderer().render(this.rootContainer, layerData);
        layerData.children?.forEach((elementData: BaseElement, elementIndex: number) => {
            const newElement = this.renderElement(layerElement, elementData);

            newElement.id = `layer[${index}].element[${elementIndex}]-` + elementData.type?.toLowerCase();
        });
    }

    /**
     * Render element from layers list in {@link ian} block.
     * @param {HTMLElement} el element to be rendered
     * @param {BaseElement} elementData style and attributes data of the element
     * @return {HTMLElement} rendered element
     * @private
     */
    private renderElement(el: HTMLElement, elementData: BaseElement): HTMLElement {
        let newElement: HTMLElement;

        if (elementData.type === 'TEXT') {
            newElement = new TextRenderer().render(el, elementData as TextElement);
        } else if (elementData.type === 'IMAGE') {
            newElement = new ImageRenderer().render(el, elementData as ImageElement);
        } else if (elementData.type === 'BUTTON') {
            newElement = new ButtonRenderer().render(el, elementData as ButtonElement);
        } else if (elementData.type === 'GROUP') {
            const groupElement = elementData as GroupElement;
            newElement = new GroupRenderer().render(el, groupElement);

            groupElement.children?.forEach((newElementData: BaseElement) => {
                this.renderElement(newElement, newElementData);
            });
        } else {
            throw new DOMException('Unsupported element type- ' + elementData.type);
        }

        return newElement;
    }

    /**
     * Render container from {@link ian} block.
     * @private
     */
    private renderContainer(): void {
        const container = this.ian!.container;
        if (!container) {
            return;
        }

        new ContainerRenderer().render(this.rootContainer, container);
    }

}
