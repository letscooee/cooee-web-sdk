import {Constants} from '../constants';

/**
 * Utility class for creating and rendering elements.
 *
 * @author Abhishek Taparia
 */
export class Renderer {

    private doc: Document = document;

    /**
     * Get root container
     * @return {HTMLDivElement} root container
     */
    public getRootContainer(): HTMLDivElement {
        this.removeInApp();

        const rootDiv = this.createElement('div') as HTMLDivElement;
        this.setAttribute(rootDiv, 'class', Constants.IN_APP_CONTAINER_NAME);
        this.setAttribute(rootDiv, 'id', Constants.IN_APP_CONTAINER_NAME);

        this.setStyle(rootDiv, 'position', 'absolute');
        this.setStyle(rootDiv, 'top', '0px');
        this.setStyle(rootDiv, 'left', '0px');

        this.appendChild(this.doc.body, rootDiv);

        return rootDiv;
    }

    /**
     * Get width of the browser
     * @return {number} inner width of the browser
     */
    public getWidth(): number {
        return window.innerWidth;
    }

    /**
     * Get height of the browser
     * @return {number} inner height of the browser
     */
    public getHeight(): number {
        return window.innerHeight;
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
        if (!styleName || value == null) {
            return;
        }

        let style = element.getAttribute('style');

        // Initialize if style is not previously initialized
        if (!style) {
            style = '';
        }

        style += styleName + ': ' + value + '; ';
        element.setAttribute('style', style);
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
    public removeInApp(): void {
        const rootDiv = this.doc.getElementById('cooee-wrapper') as HTMLDivElement;

        if (rootDiv) {
            rootDiv.parentElement!.removeChild(rootDiv);
        }
    }

}
