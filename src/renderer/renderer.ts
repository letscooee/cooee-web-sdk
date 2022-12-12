import {TriggerContext} from '../models/trigger/trigger-context';
import UAParser from 'ua-parser-js';

/**
 * Utility class for creating and rendering elements.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class Renderer {

    private static readonly DOCUMENT_STANDARD_MODE = 'CSS1Compat';  // The quirks mode is "BackCompat"
    private static _instance: Renderer;

    private parentContainer: HTMLElement;
    private scalingFactor: number;
    private readonly doc: Document = document;
    private readonly parser = new UAParser();

    // No need to instantiate this class.
    private constructor() {
    }

    static get(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }

        return Renderer._instance;
    }

    getUAParser(): UAParser {
        return this.parser;
    }

    /**
     * Get width of the parent most container where the Cooee's root div will render.
     * <code>document.body.clientWidth</code> might not be same as <code>document.documentElement.clientWidth</code>.
     *
     * @return width of the parent most container.
     */
    public getWidth(): number {
        if (this.parentContainer && (this.parentContainer !== document.body)) {
            return this.parentContainer.clientWidth;
        }

        return document.compatMode === Renderer.DOCUMENT_STANDARD_MODE ?
            document.documentElement.clientWidth :
            window.innerWidth;
    }

    /**
     * Get height of the parent most container where the Cooee's root div will render.
     * <code>document.body.clientHeight</code> might not be same as <code>document.documentElement.clientHeight</code>.
     *
     * @return height of the parent most container.
     */
    public getHeight(): number {
        if (this.isParentNotBody()) {
            return this.parentContainer.clientHeight;
        }

        return document.compatMode === Renderer.DOCUMENT_STANDARD_MODE ?
            document.documentElement.clientHeight :
            window.innerHeight;
    }

    /**
     * Return true if the website is running in a mobile device.
     *
     * @return boolean
     */
    public isMobile(): boolean {
        return this.parser.getDevice().type === 'mobile';
    }

    /**
     * Calculate scaling factor according to parent most container where the in-app's root container will be rendered.
     *
     * @param canvasWidth The width of the canvas to render.
     * @param canvasHeight The height of the canvas to render.
     * @param max Maximum desktop height/width restriction.
     */
    calculateScalingFactor(canvasWidth: number, canvasHeight: number, max?: number): void {
        let screenWidth = Renderer.get().getWidth();
        let screenHeight = Renderer.get().getHeight();

        if (max) {
            screenWidth = Math.min(screenWidth, max);
            screenHeight = Math.min(screenHeight, max);
        }

        if (screenWidth / screenHeight < canvasWidth / canvasHeight) {
            this.scalingFactor = screenWidth / canvasWidth;
        } else {
            this.scalingFactor = screenHeight / canvasHeight;
        }

        // The in-app should not scale beyond 100%
        this.scalingFactor = Math.min(this.scalingFactor, 1);
    }

    getScalingFactor(): number {
        return this.scalingFactor;
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
     *
     * @param triggerContext
     */
    removeInApp(triggerContext: TriggerContext): void {
        const rootDiv = document.querySelector(`.${triggerContext.rootClassName}`) as HTMLDivElement;
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

    /**
     * Returns true if the in-app being rendered is within a given element which is not the document.body.
     * @private
     */
    private isParentNotBody(): boolean {
        return this.parentContainer !== document.body;
    }

}
