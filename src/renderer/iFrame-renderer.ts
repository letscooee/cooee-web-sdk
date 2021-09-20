import {Renderer} from './renderer';
import {Constants} from '../constants';

/**
 * Renders iFrame element on CTAs.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class IFrameRenderer {

    renderer: Renderer;

    /**
     * Constructor
     */
    constructor() {
        this.renderer = new Renderer();
    }

    /**
     * Render iFrame element on CTAs.
     * @param {string} url URL for the iFrame.
     * @return {HTMLElement} rendered iFrame
     * @private
     */
    public render(url: string): HTMLElement {
        const root = this.renderer.getElementById(Constants.IN_APP_CONTAINER_NAME)! as HTMLDivElement;
        const iFrameDiv = this.createIFrameContainer();

        this.createIFrameElement(iFrameDiv, url);
        // Create and render close button for iFrame with anchor tag
        this.createAnchorElement(root, iFrameDiv);
        this.renderer.appendChild(root, iFrameDiv);

        return iFrameDiv;
    }

    /**
     * Create and return iFrame container for iab CTA.
     * @return {HTMLDivElement} iFrame container.
     * @private
     */
    private createIFrameContainer(): HTMLDivElement {
        const iFrameDiv = this.renderer.createElement('div') as HTMLDivElement;
        this.renderer.setAttribute(iFrameDiv, 'class', 'iframe-container');
        this.renderer.setAttribute(iFrameDiv, 'id', 'iframe-container');
        this.renderer.setStyle(iFrameDiv, 'width', '100%');
        this.renderer.setStyle(iFrameDiv, 'height', '100%');

        this.renderer.setStyle(iFrameDiv, 'position', 'absolute');
        this.renderer.setStyle(iFrameDiv, 'top', '0px');
        this.renderer.setStyle(iFrameDiv, 'left', '0px');

        return iFrameDiv;
    }

    /**
     * Create and return iFrame element for iab CTA.
     * @param {HTMLDivElement} iFrameDiv iframe container
     * @param {string} src source url to redirect
     * @return {HTMLIFrameElement} iFrame element
     * @private
     */
    private createIFrameElement(iFrameDiv: HTMLDivElement, src: string): HTMLIFrameElement {
        const iFrameElement = this.renderer.createElement('iframe') as HTMLIFrameElement;
        this.renderer.setStyle(iFrameElement, 'width', '100%');
        this.renderer.setStyle(iFrameElement, 'height', '100%');
        this.renderer.setAttribute(iFrameElement, 'src', src);
        this.renderer.setAttribute(iFrameElement, 'frameBorder', '0');

        this.renderer.appendChild(iFrameDiv, iFrameElement);

        return iFrameElement;
    }

    /**
     * Create and return close button for iFrame element
     * @param {HTMLDivElement} root root container of in-app
     * @param {HTMLDivElement} iframeDiv iframe container
     * @return {HTMLAnchorElement} close button
     * @private
     */
    private createAnchorElement(root: HTMLDivElement, iframeDiv: HTMLDivElement): HTMLAnchorElement {
        const iFrameClose = this.renderer.createElement('a') as HTMLAnchorElement;
        this.renderer.setStyle(iFrameClose, 'position', 'absolute');
        this.renderer.setStyle(iFrameClose, 'top', '0px');
        this.renderer.setStyle(iFrameClose, 'right', '0px');

        iFrameClose.href = '#';
        iFrameClose.innerHTML = 'Close';
        iFrameClose.onclick = () => {
            root.removeChild(iframeDiv);
        };

        this.renderer.appendChild(iframeDiv, iFrameClose);

        return iFrameClose;
    }

}
