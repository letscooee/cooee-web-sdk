import {Renderer} from './renderer';
import hexToRgba from 'hex-to-rgba';
import {BaseElement} from '../models/trigger/elements';
import UAParser from 'ua-parser-js';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {
    Background,
    Border,
    ClickAction,
    Colour, Flex,
    Gradient,
    Spacing,
    Transform,
} from '../models/trigger/blocks';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockProcessor {

    private static readonly HEIGHT = 1920;
    protected readonly renderer: Renderer;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    private scalingFactor: number = 1;
    private aspectRatio: number = 1;

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

        this.processWidthAndHeight(baseElement);
        this.processPositionBlock(baseElement);
        this.processBorderBlock(baseElement.br);
        this.processBgBlock(baseElement.bg);
        this.processSpaceBlock(baseElement.spc);
        this.processOverflowBlock(baseElement.clip);
        this.processTransformBlock(baseElement.trf);
        this.processFlexBlock(baseElement.fx);
        this.registerAction(baseElement.click);
    }

    /**
     * Process width and height
     * @param baseElement
     * @private
     */
    private processWidthAndHeight(baseElement: BaseElement): void {
        this.renderer.setStyle(this.element, 'box-sizing', 'border-box');

        let calculatedHeight: number = 0;
        let calculatedWidth: number = 0;
        // For Portrait mode
        if (this.screenHeight > this.screenWidth) {
            this.aspectRatio = baseElement.w / baseElement.h;
            this.scalingFactor = this.screenHeight / BlockProcessor.HEIGHT;

            calculatedHeight = baseElement.h * this.scalingFactor;
            calculatedWidth = calculatedHeight * this.aspectRatio;
        }

        this.renderer.setStyle(this.element, 'height', calculatedHeight);
        this.renderer.setStyle(this.element, 'width', calculatedWidth);
    }

    /**
     * Get calculated size according to the device
     * @param {number} value size passed in payload
     * @return number calculated size
     */
    protected getCalculatedSize(value: number): number {
        let scalingFactor: number = 1;

        if (this.screenHeight > this.screenWidth) {
            scalingFactor = this.screenHeight / BlockProcessor.HEIGHT;
        }

        return value * scalingFactor;
    }

    /**
     * Process flex block of the element
     * @param {Flex} flex data for the element
     * @private
     */
    private processFlexBlock(flex: Flex): void {
        if (!flex) {
            return;
        }
        this.renderer.setStyle(this.element, 'display', 'flex');
        this.renderer.setStyle(this.element, 'flex-direction', flex.d?.replace('_', '-').toLowerCase() ?? 'row');
        this.renderer.setStyle(this.element, 'flex-wrap', flex.w?.replace('_', '-').toLowerCase() ?? 'nowrap');
        this.renderer.setStyle(
            this.element,
            'justify-content',
            flex.jc?.replace('_', '-').toLowerCase() ?? 'flex-start',
        );
        this.renderer.setStyle(this.element, 'align-items', flex.ai?.replace('_', '-').toLowerCase() ?? 'stretch');
    }

    /**
     * Process position block of the element
     * @param {BaseElement} baseElement position data for the element
     * @private
     */
    private processPositionBlock(baseElement: BaseElement): void {
        if (baseElement.mode !== 'FREE_FLOATING') {
            return;
        }

        if (baseElement.x) this.renderer.setStyle(this.element, 'top', `${this.getCalculatedSize(baseElement.x)}px`);
        if (baseElement.y) this.renderer.setStyle(this.element, 'left', `${this.getCalculatedSize(baseElement.y)}px`);
        if (baseElement.z) this.renderer.setStyle(this.element, 'z-index', `${baseElement.z}`);
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

        // Just to make sure radius is not a negative number
        if (border.radius && border.radius > 0) {
            this.renderer.setStyle(this.element, 'border-radius', `${this.getCalculatedSize(border.radius)}px`);
        }

        // Just to make sure width is not a negative number
        if (border.width && border.width > 0) {
            this.renderer.setStyle(this.element, 'border-width', `${this.getCalculatedSize(border.width)}px`);
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

        if (space.p) this.renderer.setStyle(this.element, 'padding', `${this.getCalculatedSize(space.p)}px`);
        if (space.pt) this.renderer.setStyle(this.element, 'padding-top', `${this.getCalculatedSize(space.pt)}px`);
        if (space.pb) this.renderer.setStyle(this.element, 'padding-bottom', `${this.getCalculatedSize(space.pb)}px`);
        if (space.pl) this.renderer.setStyle(this.element, 'padding-left', `${this.getCalculatedSize(space.pl)}px`);
        if (space.pr) this.renderer.setStyle(this.element, 'padding-right', `${this.getCalculatedSize(space.pr)}px`);

        if (space.m) this.renderer.setStyle(this.element, 'margin', `${this.getCalculatedSize(space.m)}px`);
        if (space.mt) this.renderer.setStyle(this.element, 'margin-top', `${this.getCalculatedSize(space.mt)}px`);
        if (space.mb) this.renderer.setStyle(this.element, 'margin-bottom', `${this.getCalculatedSize(space.mb)}px`);
        if (space.ml) this.renderer.setStyle(this.element, 'margin-left', `${this.getCalculatedSize(space.ml)}px`);
        if (space.mr) this.renderer.setStyle(this.element, 'margin-right', `${this.getCalculatedSize(space.mr)}px`);
    }

    /**
     * Process overflow block of the element
     * @param {string} overflowData overflow data for the element
     * @private
     */
    private processOverflowBlock(overflowData: string): void {
        if (!overflowData) {
            return;
        }

        this.renderer.setStyle(this.element, 'overflow-x', overflowData.toLowerCase());
        this.renderer.setStyle(this.element, 'overflow-y', overflowData.toLowerCase());
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

            let linearFunctionString = `linear-gradient(${grad.direction}, ${c1}, ${c2}`;

            if (grad.c3) {
                const c3 = BlockProcessor.toRgba(grad.c3);
                linearFunctionString += `, ${c3}`;
            }

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
