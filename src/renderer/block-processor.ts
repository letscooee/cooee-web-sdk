import {Log} from '../utils/log';
import hexToRgba from 'hex-to-rgba';
import {Renderer} from './renderer';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 */
export class BlockProcessor {

    protected renderer: Renderer;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    /**
     * Constructor
     */
    constructor() {
        this.renderer = new Renderer();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     * @param {HTMLElement} el element to be processed
     * @param {any} data style and attributes data of the element
     * @private
     */
    protected processCommonBlocks(el: HTMLElement, data: any): void {
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
        this.registerAction(el, data.action);
    }

    /**
     * Process position block of the element
     * @param {HTMLElement} el element to be processed for position
     * @param {any} position position data for the element
     * @private
     */
    private processPositionBlock(el: HTMLElement, position: any): void {
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
     * @param {any} border border data for the element
     * @private
     */
    private processBorderBlock(el: HTMLElement, border: any): void {
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
     * @param {any} space space data for the element
     * @private
     */
    private processSpaceBlock(el: HTMLElement, space: any): void {
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
     * @param {any} font font data for the element
     * @private
     */
    private processFontBlock(el: HTMLElement, font: any): void {
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
     * @param {any} size size data for the element
     * @private
     */
    private processSizeBlock(el: HTMLElement, size: any): void {
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
     * @param {any} alignment alignment data for the element
     * @private
     */
    private processTextAlignmentBlock(el: HTMLElement, alignment: any): void {
        if (!alignment) {
            return;
        }

        this.renderer.setStyle(el, 'text-align', alignment.align?.toLowerCase());
    }

    /**
     * Process overflow block of the element
     * @param {HTMLElement} el element to be processed for overflow
     * @param {any} overflowData overflow data for the element
     * @private
     */
    private processOverflowBlock(el: HTMLElement, overflowData: any): void {
        if (!overflowData) {
            return;
        }

        this.renderer.setStyle(el, 'overflow-x', overflowData.x?.toLowerCase());
        this.renderer.setStyle(el, 'overflow-y', overflowData.y?.toLowerCase());
    }

    /**
     * Process transform block of the element
     * @param {HTMLElement} el element to be processed for transform
     * @param {any} transform transform data for the element
     * @private
     */
    private processTransformBlock(el: HTMLElement, transform: any): void {
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
     * @param {any} action action data for the element
     * @private
     */
    private registerAction(el: HTMLElement, action: any): void {
        if (!action) {
            return;
        }

        el.addEventListener('click', () => {
            this.performAction(action);
        });
    }

    /**
     * Perform CTA on element click event
     * @param {any} _action action data
     * @private
     */
    private performAction(_action: any): void {
        // TODO Add CTAs.
        // Temporary
        if (_action.external) {
            window.open(_action.external.url, '_blank')?.focus();
        }

        if (_action.kv) {
            // TODO Send key-value to client
        }

        if (_action.up) {
            // TODO Send user property back to server
        }

        if (_action.prompts) {
            // TODO Ask for location and/or push notification permission
        }

        if (_action.close) {
            this.renderer.removeInApp();
        }
    }

    /**
     * Process background block of the element
     * @param {HTMLElement} el element to be processed for background
     * @param {any} bg background data for the element
     * @private
     */
    private processBgBlock(el: HTMLElement, bg: any): void {
        if (!bg) {
            return;
        }

        if (bg.glossy) {
            this.renderer.setStyle(el, 'backdrop-filter', `blur(${bg.glossy.radius}px)`);

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
                this.renderer.setStyle(el, 'backdrop-filter', `opacity(${bg.img.alpha})`);
            }
        }
    }

    /**
     * Process colour block of the element
     * @param {HTMLElement} el element to be processed for colour
     * @param {any} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @private
     */
    private processColourBlock(el: HTMLElement, colour: any, attribute = 'color'): void {
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
