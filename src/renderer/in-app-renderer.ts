import {Props} from '../types';
import {Log} from '../utils/log';
import {BlockProcessor} from './block-processor';

/**
 * Renders In App trigger
 *
 * @author Abhishek Taparia
 */
export class InAppRenderer extends BlockProcessor {

    private readonly rootContainer: HTMLDivElement;
    private ian: Props | undefined;

    /**
     * Public constructor
     */
    constructor() {
        super();
        this.rootContainer = this.renderer.getRootContainer();
    }

    /**
     * Renders in-app trigger from payload received
     * @param {Props} ian in-app block from {@link TriggerData}
     */
    render(ian: Props): void {
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
        this.ian?.layers?.forEach((layer: Props, index: number) => {
            this.renderLayer(layer, index);
        });
    }

    /**
     * Render individual layer from layers list in {@link ian} block.
     * @param {Props} layerData style and attributes data of the layer
     * @param {number} index
     * @private
     */
    private renderLayer(layerData: Props, index: number): void {
        const layerElement = this.renderer.createElement('div');
        this.renderer.setAttribute(layerElement, 'class', 'layer');

        // By default the parents will be relative
        this.renderer.setStyle(layerElement, 'position', 'relative');
        this.renderer.appendChild(this.rootContainer, layerElement);

        // Enforcing size to be FLEX for layers (because Android has challenges in normal layouts)
        layerData.size = layerData.size ?? {};
        layerData.size.display = layerData.size.display ?? 'FLEX';

        this.processCommonBlocks(layerElement, layerData);
        layerData.children?.forEach((elementData: Props, elementIndex: number) => {
            const newElement = this.renderElement(layerElement, elementData);

            const id = `layer[${index}].element[${elementIndex}]-` + elementData.type?.toLowerCase();
            this.renderer.setAttribute(newElement, 'id', id);
        });
    }

    /**
     * Render element from layers list in {@link ian} block.
     * @param {HTMLElement} el element to be rendered
     * @param {Props} elementData style and attributes data of the element
     * @return {HTMLElement} rendered element
     * @private
     */
    private renderElement(el: HTMLElement, elementData: Props): HTMLElement {
        let newElement: HTMLElement;

        if (elementData.type === 'TEXT') {
            newElement = this.renderTextElement(elementData);
        } else if (elementData.type === 'IMAGE') {
            newElement = this.renderer.createElement('img');
            this.renderer.setAttribute(newElement, 'src', elementData.url);
            this.renderer.setStyle(newElement, 'max-width', '100%');
            this.renderer.setStyle(newElement, 'max-height', '100%');
            this.renderer.setStyle(newElement, 'display', 'block');
            this.renderer.setStyle(newElement, 'margin', '0 auto');
        } else if (elementData.type === 'BUTTON') {
            newElement = this.renderer.createElement('button');
            newElement.innerHTML = elementData.text;
        } else if (elementData.type === 'GROUP') {
            newElement = this.renderer.createElement('div');
            // By default the parents will be relative
            this.renderer.setStyle(newElement, 'position', 'relative');

            // Enforcing size to be FLEX for GROUP (because Android has challenges in normal layouts)
            elementData.size = elementData.size ?? {};
            elementData.size.display = elementData.size.display ?? 'FLEX';

            elementData.children?.forEach((newElementData: Props) => {
                this.renderElement(newElement, newElementData);
            });
        } else {
            throw new DOMException('Unsupported element type- ' + elementData.type);
        }

        this.processCommonBlocks(newElement, elementData);
        this.renderer.setAttribute(newElement, 'class', elementData.type);
        this.renderer.appendChild(el, newElement);

        return newElement;
    }

    /**
     * Render text element from layers list in {@link ian} block.
     * @param {Props} elementData style and attributes data of the text element
     * @return {HTMLDivElement} rendered text element in a {@link HTMLDivElement}
     * @private
     */
    private renderTextElement(elementData: Props): HTMLDivElement {
        const newElement = this.renderer.createElement('div');
        this.processCommonBlocks(newElement, elementData);

        if (elementData.parts) {
            elementData.parts.forEach((partData: Props) => {
                const newPartElement = this.renderer.createElement('span');
                newPartElement.innerHTML = partData.text;
                this.processCommonBlocks(newPartElement, partData);
                this.renderer.appendChild(newElement, newPartElement);
            });
        } else {
            newElement.innerHTML = elementData.text;
        }

        return newElement as HTMLDivElement;
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

        this.processCommonBlocks(this.rootContainer, container);
    }

}
