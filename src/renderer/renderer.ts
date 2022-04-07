import {Constants} from '../constants';

/**
 * Utility class for creating and rendering elements.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class Renderer {

    private static _instance: Renderer;

    private parentContainer: HTMLElement;
    private readonly doc: Document = document;

    // No need to instantiate this class.
    private constructor() {
    }

    static get(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }

        return Renderer._instance;
    }

    /**
     * Get width of the parent most container where the Cooee's root div will render.
     * @return width of the parent most container.
     */
    public getWidth(): number {
        if (this.parentContainer) {
            return this.parentContainer.clientWidth;
        }

        return document.documentElement.clientWidth;
    }

    /**
     * Get height of the parent most container where the Cooee's root div will render.
     * @return height of the parent most container.
     */
    public getHeight(): number {
        if (this.parentContainer) {
            return this.parentContainer.clientHeight;
        }

        return document.documentElement.clientHeight;
    }

    /**
     * Creates an element
     * @param {string} elementType element type to be created
     * @return {HTMLElement} created element
     */
    public createElement(elementType: string): HTMLElement {
        return this.doc.createElement(elementType);
    }

    /**
     * Append a child to parent element
     * @param {HTMLElement} parentElement element on which child is to be appended
     * @param {HTMLElement} childElement element to to appended
     */
    public appendChild(parentElement: HTMLElement, childElement: HTMLElement): void {
        parentElement.appendChild(childElement);
    }

    /**
     * Set style of the element
     * @param {HTMLElement} element element on which styles is added
     * @param {string} styleName style name
     * @param {any} value style value
     */
    public setStyle(element: HTMLElement, styleName: string, value: any): void {
        // Return if style or value is null or undefined
        if (!styleName) {
            return;
        }

        if (!value) {
            element.style.removeProperty(styleName);
            return;
        }

        element.style.setProperty(styleName, value, 'important');
    }

    /**
     * Set style of the element
     * @param {HTMLElement} element element on which attribute is added
     * @param {string} attrName attribute name
     * @param {any} value attribute value
     */
    public setAttribute(element: HTMLElement, attrName: string, value: any): void {
        element.setAttribute(attrName, value as string);
    }

    /**
     * Remove InApp trigger.
     */
    removeInApp(): void {
        const rootDiv = document.querySelector(`.${Constants.IN_APP_CONTAINER_NAME}`) as HTMLDivElement;
        if (rootDiv) {
            rootDiv.parentElement!.removeChild(rootDiv);
        }
    }

    /**
     * Set the parent most container where the Cooee's In-App's root div will render.
     * @param container The HTML holder element.
     */
    setParentContainer(container: HTMLElement): void {
        this.parentContainer = container;
    }

}
