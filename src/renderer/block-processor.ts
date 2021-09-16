import {Log} from '../utils/log';
import {Renderer} from './renderer';
import {Props} from '../types';
import hexToRgba from 'hex-to-rgba';
import {Constants} from '../constants';
import {SafeHttpService} from '../services/safe-http-service';
import {Event} from '../models/event/event';
import {TriggerData} from '../models/trigger/trigger-data';
import UAParser from 'ua-parser-js';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 */
export class BlockProcessor {

    protected readonly renderer: Renderer;
    protected readonly apiService: SafeHttpService;
    protected triggerData: TriggerData | undefined;
    protected startTime: number = 0;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    /**
     * Constructor
     */
    constructor() {
        this.renderer = new Renderer();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();

        this.apiService = SafeHttpService.getInstance();
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     * @param {HTMLElement} el element to be processed
     * @param {Props} data style and attributes data of the element
     * @private
     */
    protected processCommonBlocks(el: HTMLElement, data: Props): void {
        this.processSizeBlock(el, data.size);
        this.processPositionBlock(el, data.position);
        this.processBorderBlock(el, data.border);
        this.processBgBlock(el, data.bg);
        this.processSpaceBlock(el, data.spacing);
        this.processFontBlock(el, data.font);
        this.processColourBlock(el, data.colour);
        this.processTextAlignmentBlock(el, data.alignment);
        this.processOverflowBlock(el, data.overflow);
        this.processTransformBlock(el, data.transform);
        this.registerAction(el, data.click);
    }

    /**
     * Process position block of the element
     * @param {HTMLElement} el element to be processed for position
     * @param {Props} position position data for the element
     * @private
     */
    private processPositionBlock(el: HTMLElement, position: Props): void {
        if (!position) {
            return;
        }

        this.renderer.setStyle(el, 'position', position.type?.toLowerCase());
        this.renderer.setStyle(el, 'top', position.top);
        this.renderer.setStyle(el, 'bottom', position.bottom);
        this.renderer.setStyle(el, 'left', position.left);
        this.renderer.setStyle(el, 'right', position.right);
        if (position.zIndex) this.renderer.setStyle(el, 'z-index', position.zIndex);
    }

    /**
     * Process border block of the element
     * @param {HTMLElement} el element to be processed for border
     * @param {Props} border border data for the element
     * @private
     */
    private processBorderBlock(el: HTMLElement, border: Props): void {
        if (!border) {
            return;
        }
        if (border.radius) {
            this.renderer.setStyle(el, 'border-radius', border.radius);
        }
        if (border.width) {
            this.renderer.setStyle(el, 'border-width', border.width);
            this.renderer.setStyle(el, 'border-style', border.style?.toLowerCase() ?? 'solid');

            if (border.colour) {
                this.processColourBlock(el, border.colour, 'border-color');
            } else {
                this.renderer.setStyle(el, 'border-color', 'black');
            }
        }
    }

    /**
     * Process space block of the element which include margin and padding.
     * @param {HTMLElement} el element to be processed for space
     * @param {Props} space space data for the element
     * @private
     */
    private processSpaceBlock(el: HTMLElement, space: Props): void {
        if (!space) {
            return;
        }

        if (space.p) this.renderer.setStyle(el, 'padding', space.p);
        if (space.pt) this.renderer.setStyle(el, 'padding-top', space.pt);
        if (space.pb) this.renderer.setStyle(el, 'padding-bottom', space.pb);
        if (space.pl) this.renderer.setStyle(el, 'padding-left', space.pl);
        if (space.pr) this.renderer.setStyle(el, 'padding-right', space.pr);

        if (space.m) this.renderer.setStyle(el, 'margin', space.m);
        if (space.mt) this.renderer.setStyle(el, 'margin-top', space.mt);
        if (space.mb) this.renderer.setStyle(el, 'margin-bottom', space.mb);
        if (space.ml) this.renderer.setStyle(el, 'margin-left', space.ml);
        if (space.mr) this.renderer.setStyle(el, 'margin-right', space.mr);
    }

    /**
     * Process font block of the element
     * @param {HTMLElement} el element to be processed for font
     * @param {Props} font font data for the element
     * @private
     */
    private processFontBlock(el: HTMLElement, font: Props): void {
        if (!font) {
            return;
        }

        this.renderer.setStyle(el, 'font-size', font.size);
        this.renderer.setStyle(el, 'font-weight', font.weight);
        this.renderer.setStyle(el, 'font-family', font.family);
        this.renderer.setStyle(el, 'font-style', font.style);
        this.renderer.setStyle(el, 'line-height', font.lineHeight);
    }

    /**
     * Process size block of the element
     * @param {HTMLElement} el element to be processed for size
     * @param {Props} size size data for the element
     * @private
     */
    private processSizeBlock(el: HTMLElement, size: Props): void {
        if (!size) {
            size = {};
        }

        const display = size.display ?? 'BLOCK';

        this.renderer.setStyle(el, 'display', display.toLowerCase().replace('_', '-'));
        if (display === 'FLEX') {
            this.renderer.setStyle(el, 'flex-direction', size.direction?.toLowerCase()?.replace('_', '-'));
            this.renderer.setStyle(el, 'flex-wrap', size.wrap?.toLowerCase()?.replace('_', '-'));
            this.renderer.setStyle(el, 'justify-content', size.justifyContent?.toLowerCase()?.replace('_', '-'));
            this.renderer.setStyle(el, 'align-items', size.alignItems?.toLowerCase()?.replace('_', '-'));
        }

        if (size.maxW || size.maxH) {
            this.renderer.setStyle(el, 'max-width', size.maxW);
            this.renderer.setStyle(el, 'max-height', size.maxH);
        }

        if (size.width) {
            if (size.width.includes('px')) {
                if (parseInt(size.width.replace('px', '')) > this.screenWidth) {
                    Log.w('container.size.width can\'t be more than the screen size');
                }
            }

            if (size.width.includes('vw')) {
                const unit = parseInt(size.width.replace('vw', ''));
                this.renderer.setStyle(el, 'width', (this.screenWidth * unit / 100) + 'px');
            } else if (size.width.includes('vh')) {
                const unit = parseInt(size.width.replace('vh', ''));
                this.renderer.setStyle(el, 'width', (this.screenHeight * unit / 100) + 'px');
            } else {
                this.renderer.setStyle(el, 'width', size.width);
            }
        }

        if (size.height) {
            if (size.height.includes('px')) {
                if (parseInt(size.height.replace('px', '')) > this.screenHeight) {
                    Log.w('container.size.height can\'t be more than the screen size');
                }
            }

            if (size.height.includes('vw')) {
                const unit = parseInt(size.height.replace('vw', ''));
                this.renderer.setStyle(el, 'height', (this.screenWidth * unit / 100) + 'px');
            } else if (size.height.includes('vh')) {
                const unit = parseInt(size.height.replace('vh', ''));
                this.renderer.setStyle(el, 'height', (this.screenHeight * unit / 100) + 'px');
            } else {
                this.renderer.setStyle(el, 'height', size.height);
            }
        }
    }

    /**
     * Process text alignment block of the element
     * @param {HTMLElement} el element to be processed for text alignment
     * @param {Props} alignment alignment data for the element
     * @private
     */
    private processTextAlignmentBlock(el: HTMLElement, alignment: Props): void {
        if (!alignment) {
            return;
        }

        this.renderer.setStyle(el, 'text-align', alignment.align?.toLowerCase());
    }

    /**
     * Process overflow block of the element
     * @param {HTMLElement} el element to be processed for overflow
     * @param {Props} overflowData overflow data for the element
     * @private
     */
    private processOverflowBlock(el: HTMLElement, overflowData: Props): void {
        if (!overflowData) {
            return;
        }

        this.renderer.setStyle(el, 'overflow-x', overflowData.x?.toLowerCase());
        this.renderer.setStyle(el, 'overflow-y', overflowData.y?.toLowerCase());
    }

    /**
     * Process transform block of the element
     * @param {HTMLElement} el element to be processed for transform
     * @param {Props} transform transform data for the element
     * @private
     */
    private processTransformBlock(el: HTMLElement, transform: Props): void {
        if (!transform) {
            return;
        }

        if (transform.rotate) {
            this.renderer.setStyle(el, 'transform', `rotate(${transform.rotate}deg)`);
        }
    }

    /**
     * Register click-to-action(CTA) block of the element
     * @param {HTMLElement} el element to be processed for CTA
     * @param {Props} action action data for the element
     * @private
     */
    private registerAction(el: HTMLElement, action: Props): void {
        if (!action) {
            return;
        }

        el.addEventListener('click', () => {
            this.performAction(action);
        });
    }

    /**
     * Perform CTA on element click event
     * @param {Props} _action action data
     * @private
     */
    private performAction(_action: Props): void {
        if (_action.external) {
            window.open(_action.external.url, '_blank')?.focus();
        }

        // iab -> in-app browser or iFrame in web
        if (_action.iab) {
            const root = this.renderer.getElementById(Constants.IN_APP_CONTAINER_NAME)! as HTMLDivElement;
            const iFrameDiv = this.createIFrameContainer();

            this.createIFrameElement(iFrameDiv, _action.iab.url);
            // Create and render close button for iFrame with anchor tag
            this.createAnchorElement(root, iFrameDiv);
            this.renderer.appendChild(root, iFrameDiv);
        }

        if (_action.up) {
            this.apiService.updateProfile(_action.up);
        }

        if (_action.kv) {
            document.dispatchEvent(new CustomEvent('onCooeeCTA', {'detail': _action.kv}));
        }

        if (_action.prompts) {
            // TODO test in mobile browsers
            console.log('prompts', _action.prompts);
            for (const permission of _action.prompts) {
                if (permission === 'LOCATION') {
                    this.promptLocationPermission();
                }

                if (permission === 'PUSH') {
                    this.promptPushNotificationPermission();
                }
            }
        }

        if (_action.close) {
            this.renderer.removeInApp();

            const diffInSeconds = (new Date().getTime() - this.startTime) / 1000;

            const eventProps: Props = {
                'triggerID': this.triggerData?.id,
                'Close Behaviour': 'CTA',
                'Duration': diffInSeconds,
            };
            this.apiService.sendEvent(new Event('CE Trigger Closed', eventProps));
        }

        // Navigator.share only works in mobile browsers and with https urls.
        // {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share}
        if (_action.share) {
            // TODO test in mobile browsers
            const share = navigator.share;

            if (!share) {
                Log.w('Navigator.share is not compatible with this browser');
                return;
            }

            share({'text': _action.share.text, 'title': 'Share'} as ShareData)
                .then((r) => console.log(r));
        }
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

    /**
     * This prompts for the location permission from the user and if granted sends <code>coords</code>
     * back to server as user properties.
     * @private
     */
    private promptLocationPermission(): void {
        if (!navigator.geolocation || !navigator.permissions) {
            return;
        }

        // TODO Need device endpoints to update this property
        navigator.geolocation.getCurrentPosition((position) => {
            this.apiService.updateProfile({'coords': [position.coords.latitude, position.coords.longitude]});
        });
    }

    /**
     * This prompts for the push notification permission from the user.
     * @private
     */
    private promptPushNotificationPermission(): void {
        if (!('Notification' in window)) {
            Log.w('This browser does not support desktop notification');
            return;
        }

        // TODO Need device endpoints to update this property
        if (Notification.permission !== 'default') {
            this.apiService.updateProfile({'pnPerm': Notification.permission});
            return;
        }

        Notification.requestPermission()
            .then((permission) => {
                this.apiService.updateProfile({'pnPerm': permission});
            });
    }

    /**
     * Process background block of the element
     * @param {HTMLElement} el element to be processed for background
     * @param {Props} bg background data for the element
     * @private
     */
    private processBgBlock(el: HTMLElement, bg: Props): void {
        if (!bg) {
            return;
        }

        let prefix = '';
        if (new UAParser().getBrowser().name?.toLowerCase().includes('safari')) {
            prefix = '-webkit-';
        }

        if (bg.glossy) {
            this.renderer.setStyle(el, prefix + 'backdrop-filter', `blur(${bg.glossy.radius}px)`);

            if (bg.glossy.colour) {
                this.processColourBlock(el, bg.glossy.colour, 'background');
            }
        } else if (bg.solid) {
            if (bg.solid.grad) {
                const grad = bg.solid.grad;

                if (grad.type === 'linear') {
                    const gradient = `linear-gradient(${grad.angle}deg, ${grad.c1}, ${grad.c2}, ${grad.c3})`;
                    this.renderer.setStyle(el, 'background', gradient);
                } else {
                    Log.w('Unsupported value of bg.colour.grad.type');
                    return;
                }
            } else if (bg.solid.hex) {
                const colour = this.toRgba(bg.solid.hex);
                this.renderer.setStyle(el, 'background', colour);
            }
        } else if (bg.img) {
            if (!bg.img.url) {
                Log.w('bg.img.url is missing');
                return;
            }

            const value = `url("${bg.img.url}") no-repeat center`;
            this.renderer.setStyle(el, 'background', value);
            this.renderer.setStyle(el, 'background-size', 'cover');

            if (bg.img.alpha) {
                this.renderer.setStyle(el, prefix + 'backdrop-filter', `opacity(${bg.img.alpha})`);
            }
        }
    }

    /**
     * Process colour block of the element
     * @param {HTMLElement} el element to be processed for colour
     * @param {Props} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @private
     */
    private processColourBlock(el: HTMLElement, colour: Props, attribute = 'color'): void {
        if (!colour) {
            return;
        }

        if (colour.grad) {
            const grad = colour.grad;

            if (grad.type === 'linear') {
                const gradient = `linear-gradient(${grad.direction}, ${grad.start}, ${grad.end})`;
                this.renderer.setStyle(el, attribute, gradient);
            } else {
                Log.w('Unsupported value of colour.grad.type');
            }
        } else if (colour.hex) {
            const rgba = this.toRgba(colour.hex);
            this.renderer.setStyle(el, attribute, rgba);
        }
    }

    /**
     * Convert to RGBA.
     * @param {string} hex hex-colour info Eg. '#45FF0000'(Red with alpha 45), '#FF0000FF'(Blue)
     * @return {string}
     * @private
     */
    private toRgba(hex: string): string {
        if (!hex) return '';

        // https://github.com/misund/hex-to-rgba/issues/360
        if (hex.length === (1 + 2 + 6)) {
            hex = '#' + hex.substring(3) + hex.substring(1, 3);
        }

        return hexToRgba(hex);
    }

}
