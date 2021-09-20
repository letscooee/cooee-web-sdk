import {Log} from '../utils/log';
import {Renderer} from './renderer';
import hexToRgba from 'hex-to-rgba';
import {BaseElement, BaseTextElement} from '../models/trigger/elements';
import UAParser from 'ua-parser-js';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {
    Size, Position, Border, Background, Spacing, Overflow, Transform,
    ClickAction, Font, Colour, Alignment,
} from '../models/trigger/blocks';
import {SafeHttpService} from '../services/safe-http-service';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockProcessor {

    protected readonly renderer: Renderer;
    protected readonly apiService: SafeHttpService;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    /**
     * Constructor
     */
    protected constructor() {
        this.renderer = new Renderer();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();

        this.apiService = SafeHttpService.getInstance();
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     * @param {HTMLElement} el element to be processed
     * @param {BaseElement} baseElement style and attributes data of the element
     * @private
     */
    public processCommonBlocks(el: HTMLElement, baseElement: BaseElement): void {
        this.processSizeBlock(el, baseElement.size);
        this.processPositionBlock(el, baseElement.position);
        this.processBorderBlock(el, baseElement.border);
        this.processBgBlock(el, baseElement.bg);
        this.processSpaceBlock(el, baseElement.spacing);
        this.processOverflowBlock(el, baseElement.overflow);
        this.processTransformBlock(el, baseElement.transform);
        this.registerAction(el, baseElement.click);

        if (baseElement.type === 'BUTTON' || baseElement.type === 'TEXT') {
            const baseTextElement = baseElement as BaseTextElement;
            this.processFontBlock(el, baseTextElement.font);
            this.processColourBlock(el, baseTextElement.colour);
            this.processTextAlignmentBlock(el, baseTextElement.alignment);
        }
    }

    /**
     * Process position block of the element
     * @param {HTMLElement} el element to be processed for position
     * @param {Position} position position data for the element
     * @private
     */
    private processPositionBlock(el: HTMLElement, position: Position): void {
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
     * @param {Border} border border data for the element
     * @private
     */
    private processBorderBlock(el: HTMLElement, border: Border): void {
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
     * @param {Spacing} space space data for the element
     * @private
     */
    private processSpaceBlock(el: HTMLElement, space: Spacing): void {
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
     * @param {Font} font font data for the element
     * @private
     */
    private processFontBlock(el: HTMLElement, font: Font): void {
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
     * @param {Size} size size data for the element
     * @private
     */
    private processSizeBlock(el: HTMLElement, size: Size): void {
        if (!size) {
            return;
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

            this.renderer.setStyle(el, 'width', size.width);
        }

        if (size.height) {
            if (size.height.includes('px')) {
                if (parseInt(size.height.replace('px', '')) > this.screenHeight) {
                    Log.w('container.size.height can\'t be more than the screen size');
                }
            }

            this.renderer.setStyle(el, 'height', size.height);
        }
    }

    /**
     * Process text alignment block of the element
     * @param {HTMLElement} el element to be processed for text alignment
     * @param {Alignment} alignment alignment data for the element
     * @private
     */
    private processTextAlignmentBlock(el: HTMLElement, alignment: Alignment): void {
        if (!alignment) {
            return;
        }

        this.renderer.setStyle(el, 'text-align', alignment.align?.toLowerCase());
    }

    /**
     * Process overflow block of the element
     * @param {HTMLElement} el element to be processed for overflow
     * @param {Overflow} overflowData overflow data for the element
     * @private
     */
    private processOverflowBlock(el: HTMLElement, overflowData: Overflow): void {
        if (!overflowData) {
            return;
        }

        this.renderer.setStyle(el, 'overflow-x', overflowData.x?.toLowerCase());
        this.renderer.setStyle(el, 'overflow-y', overflowData.y?.toLowerCase());
    }

    /**
     * Process transform block of the element
     * @param {HTMLElement} el element to be processed for transform
     * @param {Transform} transform transform data for the element
     * @private
     */
    private processTransformBlock(el: HTMLElement, transform: Transform): void {
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
     * @param {ClickAction} action action data for the element
     * @private
     */
    private registerAction(el: HTMLElement, action: ClickAction): void {
        if (!action) {
            return;
        }

        el.addEventListener('click', () => {
            new ClickActionExecutor(action).execute();
        });
    }

    /**
     * Process background block of the element
     * @param {HTMLElement} el element to be processed for background
     * @param {Background} bg background data for the element
     * @private
     */
    private processBgBlock(el: HTMLElement, bg: Background): void {
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
     * @param {Colour} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @private
     */
    private processColourBlock(el: HTMLElement, colour: Colour, attribute = 'color'): void {
        if (!colour) {
            return;
        }

        if (colour.grad) {
            const grad = colour.grad;

            if (grad.type === 'linear') {
                const gradient = `linear-gradient(${grad.direction}, ${grad.c1}, ${grad.c2})`;
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
