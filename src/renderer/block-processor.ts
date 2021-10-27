import {Log} from '../utils/log';
import {Renderer} from './renderer';
import hexToRgba from 'hex-to-rgba';
import {BaseElement} from '../models/trigger/elements';
import UAParser from 'ua-parser-js';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {
    Size, Position, Border, Background, Spacing, Overflow, Transform,
    ClickAction, Colour, Gradient,
} from '../models/trigger/blocks';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockProcessor {

    protected readonly renderer: Renderer;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    // @ts-ignore
    protected element: HTMLElement;

    /**
     * Constructor
     */
    protected constructor() {
        this.renderer = new Renderer();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     * @param {HTMLElement} element element to be processed
     * @param {BaseElement} baseElement style and attributes data of the element
     * @private
     */
    public processCommonBlocks(element: HTMLElement, baseElement: BaseElement): void {
        if (!element) return;

        this.element = element;

        this.processSizeBlock(baseElement.size);
        this.processPositionBlock(baseElement.position);
        this.processBorderBlock(baseElement.border);
        this.processBgBlock(baseElement.bg);
        this.processSpaceBlock(baseElement.spacing);
        this.processOverflowBlock(baseElement.overflow);
        this.processTransformBlock(baseElement.transform);
        this.registerAction(baseElement.click);
    }

    /**
     * Process position block of the element
     * @param {Position} position position data for the element
     * @private
     */
    private processPositionBlock(position: Position): void {
        if (!position) {
            return;
        }

        this.renderer.setStyle(this.element, 'position', position.type?.toLowerCase());
        this.renderer.setStyle(this.element, 'top', position.top);
        this.renderer.setStyle(this.element, 'bottom', position.bottom);
        this.renderer.setStyle(this.element, 'left', position.left);
        this.renderer.setStyle(this.element, 'right', position.right);
        if (position.zIndex) this.renderer.setStyle(this.element, 'z-index', position.zIndex);
    }

    /**
     * Process border block of the element
     * @param {Border} border border data for the element
     * @private
     */
    private processBorderBlock(border: Border): void {
        if (!border) {
            return;
        }

        if (border.radius) {
            this.renderer.setStyle(this.element, 'border-radius', border.radius);
        }

        if (border.width) {
            this.renderer.setStyle(this.element, 'border-width', border.width);
            this.renderer.setStyle(this.element, 'border-style', border.style?.toLowerCase() ?? 'solid');

            if (border.colour) {
                this.processColourBlock(border.colour, 'border-color');
            } else {
                this.renderer.setStyle(this.element, 'border-color', 'black');
            }
        }
    }

    /**
     * Process space block of the element which include margin and padding.
     * @param {Spacing} space space data for the element
     * @private
     */
    private processSpaceBlock(space: Spacing): void {
        if (!space) {
            return;
        }

        if (space.p) this.renderer.setStyle(this.element, 'padding', space.p);
        if (space.pt) this.renderer.setStyle(this.element, 'padding-top', space.pt);
        if (space.pb) this.renderer.setStyle(this.element, 'padding-bottom', space.pb);
        if (space.pl) this.renderer.setStyle(this.element, 'padding-left', space.pl);
        if (space.pr) this.renderer.setStyle(this.element, 'padding-right', space.pr);

        if (space.m) this.renderer.setStyle(this.element, 'margin', space.m);
        if (space.mt) this.renderer.setStyle(this.element, 'margin-top', space.mt);
        if (space.mb) this.renderer.setStyle(this.element, 'margin-bottom', space.mb);
        if (space.ml) this.renderer.setStyle(this.element, 'margin-left', space.ml);
        if (space.mr) this.renderer.setStyle(this.element, 'margin-right', space.mr);
    }

    /**
     * Process size block of the element
     * @param {Size} size size data for the element
     * @private
     */
    private processSizeBlock(size: Size): void {
        if (!size) {
            return;
        }

        const display = size.display ?? 'BLOCK';

        this.renderer.setStyle(this.element, 'display', display.toLowerCase().replace('_', '-'));
        if (display === 'FLEX') {
            this.renderer.setStyle(this.element, 'flex-direction', size.direction?.toLowerCase()?.replace('_', '-'));
            this.renderer.setStyle(this.element, 'flex-wrap', size.wrap?.toLowerCase()?.replace('_', '-'));
            // eslint-disable-next-line max-len
            this.renderer.setStyle(this.element, 'justify-content', size.justifyContent?.toLowerCase()?.replace('_', '-'));
            this.renderer.setStyle(this.element, 'align-items', size.alignItems?.toLowerCase()?.replace('_', '-'));
        }

        if (size.maxW || size.maxH) {
            this.renderer.setStyle(this.element, 'max-width', size.maxW);
            this.renderer.setStyle(this.element, 'max-height', size.maxH);
        }

        if (size.width) {
            if (size.width.includes('px') && parseInt(size.width.replace('px', '')) > this.screenWidth) {
                Log.w('container.size.width can\'t be more than the screen size');
            }

            this.renderer.setStyle(this.element, 'width', size.width);
        }

        if (size.height) {
            if (size.height.includes('px') && parseInt(size.height.replace('px', '')) > this.screenHeight) {
                Log.w('container.size.height can\'t be more than the screen size');
            }

            this.renderer.setStyle(this.element, 'height', size.height);
        }
    }

    /**
     * Process overflow block of the element
     * @param {Overflow} overflowData overflow data for the element
     * @private
     */
    private processOverflowBlock(overflowData: Overflow): void {
        if (!overflowData) {
            return;
        }

        this.renderer.setStyle(this.element, 'overflow-x', overflowData.x?.toLowerCase());
        this.renderer.setStyle(this.element, 'overflow-y', overflowData.y?.toLowerCase());
    }

    /**
     * Process transform block of the element
     * @param {Transform} transform transform data for the element
     * @private
     */
    private processTransformBlock(transform: Transform): void {
        if (!transform) {
            return;
        }

        if (transform.rotate) {
            this.renderer.setStyle(this.element, 'transform', `rotate(${transform.rotate}deg)`);
        }
    }

    /**
     * Register click-to-action(CTA) block of the element
     * @param {ClickAction} action action data for the element
     * @private
     */
    private registerAction(action: ClickAction): void {
        if (!action) {
            return;
        }

        this.element.addEventListener('click', () => {
            new ClickActionExecutor(action).execute();
        });
    }

    /**
     * Process background block of the element
     * @param {Background} bg background data for the element
     * @private
     */
    private processBgBlock(bg: Background): void {
        if (!bg) {
            return;
        }

        let prefix = '';
        if (new UAParser().getBrowser().name?.toLowerCase().includes('safari')) {
            prefix = '-webkit-';
        }

        if (bg.glossy) {
            this.renderer.setStyle(this.element, prefix + 'backdrop-filter', `blur(${bg.glossy.radius}px)`);

            if (bg.glossy.colour) {
                this.processColourBlock(bg.glossy.colour, 'background');
            }
        } else if (bg.solid) {
            if (bg.solid.grad) {
                this.processGradient(bg.solid.grad, 'background');
            } else if (bg.solid.hex) {
                const colour = BlockProcessor.toRgba(bg.solid.hex);
                this.renderer.setStyle(this.element, 'background', colour);
            }
        } else if (bg.img) {
            if (!bg.img.url) {
                return;
            }

            const value = `url("${bg.img.url}") no-repeat center`;
            this.renderer.setStyle(this.element, 'background', value);
            this.renderer.setStyle(this.element, 'background-size', 'cover');

            if (bg.img.alpha) {
                this.renderer.setStyle(this.element, prefix + 'backdrop-filter', `opacity(${bg.img.alpha})`);
            }
        }
    }

    /**
     * Process linear gradient and add to the element
     * @param {Gradient} grad gradient value
     * @param {string} attribute attribute on which gradient needs to be applied
     * @private
     */
    private processGradient(grad: Gradient, attribute: string): void {
        if (grad.type === 'LINEAR') {
            const c1 = BlockProcessor.toRgba(grad.c1);
            const c2 = BlockProcessor.toRgba(grad.c2);
            const c3 = BlockProcessor.toRgba(grad.c3);

            let linearFunctionString = `linear-gradient(${grad.direction}, ${c1}, ${c2}, ${c3}`;

            if (grad.c4) {
                const c4 = BlockProcessor.toRgba(grad.c4);
                linearFunctionString += `, ${c4}`;
            }

            if (grad.c5) {
                const c5 = BlockProcessor.toRgba(grad.c5);
                linearFunctionString += `, ${c5}`;
            }

            linearFunctionString += `)`;
            const gradient = linearFunctionString;
            this.renderer.setStyle(this.element, attribute, gradient);
        } else {
            Log.w('Unsupported value of colour.grad.type');
        }
    }

    /**
     * Process colour block of the element
     * @param {Colour} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @private
     */
    protected processColourBlock(colour: Colour, attribute = 'color'): void {
        if (!colour) {
            return;
        }

        if (colour.grad) {
            this.processGradient(colour.grad, attribute);
        } else if (colour.hex) {
            const rgba = BlockProcessor.toRgba(colour.hex);
            this.renderer.setStyle(this.element, attribute, rgba);
        }
    }

    /**
     * Convert to RGBA.
     * @param {string} hex hex-colour info Eg. '#45FF0000'(Red with alpha 45), '#FF0000FF'(Blue)
     * @return {string}
     * @private
     */
    private static toRgba(hex: string): string {
        if (!hex) return '';

        // https://github.com/misund/hex-to-rgba/issues/360
        if (hex.length === (1 + 2 + 6)) {
            hex = '#' + hex.substring(3) + hex.substring(1, 3);
        }

        return hexToRgba(hex);
    }

}
