import {Renderer} from './renderer';
import {BaseElement} from '../models/trigger/elements';
import UAParser from 'ua-parser-js';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {Background, Border, ClickAction, Color, Gradient, Spacing, Transform} from '../models/trigger/blocks';
import {getScalingFactor} from './index';

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

    private scalingFactor: number = getScalingFactor();

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
    protected processCommonBlocks(element: HTMLElement, baseElement: BaseElement): void {
        this.element = element;
        this.element.classList.add(baseElement.typeAsString?.toLowerCase());

        this.processWidthAndHeight(baseElement);
        this.processPositionBlock(baseElement);
        this.processBorderBlock(baseElement.br);
        this.processBackgroundBlock(baseElement.bg);
        this.processSpaceBlock(baseElement.spc);
        this.processTransformBlock(baseElement.trf);
        this.registerAction(baseElement.click);

        this.renderer.setStyle(this.element, 'overflow', 'visible');
        this.renderer.setStyle(this.element, 'outline', 'none');
    }

    /**
     * Process width and height
     * @param baseElement
     * @private
     */
    private processWidthAndHeight(baseElement: BaseElement): void {
        this.renderer.setStyle(this.element, 'box-sizing', 'border-box');

        if (baseElement.w) {
            this.renderer.setStyle(this.element, 'width', this.getSizePx(baseElement.w));
        }

        if (baseElement.h) {
            this.renderer.setStyle(this.element, 'height', this.getSizePx(baseElement.h));
        }
    }

    /**
     * Get calculated size according to the device by multiplying it with scaling factor.
     * @param {number} value size passed in payload
     * @return number calculated size
     */
    protected getSizePx(value: number): string {
        return (value * this.scalingFactor) + 'px';
    }

    /**
     * Process position block of the element
     * @param {BaseElement} baseElement position data for the element
     * @private
     */
    private processPositionBlock(baseElement: BaseElement): void {
        if (!baseElement.x) {
            return;
        }

        this.renderer.setStyle(this.element, 'position', 'absolute');
        if (baseElement.x) this.renderer.setStyle(this.element, 'top', this.getSizePx(baseElement.y));
        if (baseElement.y) this.renderer.setStyle(this.element, 'left', this.getSizePx(baseElement.x));
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
            this.renderer.setStyle(this.element, 'border-radius', this.getSizePx(border.radius));
        }

        // Just to make sure width is not a negative number
        if (border.width && border.width > 0) {
            this.renderer.setStyle(this.element, 'border-width', this.getSizePx(border.width));
            this.renderer.setStyle(this.element, 'border-style', border.style?.toLowerCase());

            if (border.color) {
                this.processColourBlock(border.color, 'border-color');
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

        if (space.p) this.renderer.setStyle(this.element, 'padding', this.getSizePx(space.p));
        if (space.pt) this.renderer.setStyle(this.element, 'padding-top', this.getSizePx(space.pt));
        if (space.pb) this.renderer.setStyle(this.element, 'padding-bottom', this.getSizePx(space.pb));
        if (space.pl) this.renderer.setStyle(this.element, 'padding-left', this.getSizePx(space.pl));
        if (space.pr) this.renderer.setStyle(this.element, 'padding-right', this.getSizePx(space.pr));

        this.renderer.setStyle(this.element, 'margin', '0 !important');
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
    private processBackgroundBlock(bg: Background): void {
        if (!bg) {
            return;
        }

        let prefix = '';
        if (new UAParser().getBrowser().name?.toLowerCase().includes('safari')) {
            prefix = '-webkit-';
        }

        if (bg.glossy) {
            this.renderer.setStyle(this.element, prefix + 'backdrop-filter', `blur(${bg.glossy.radius}px)`);

            if (bg.glossy.color) {
                this.processColourBlock(bg.glossy.color, 'background');
            }
        } else if (bg.solid) {
            if (bg.solid.grad) {
                this.processGradient(bg.solid.grad, 'background');
            } else if (bg.solid.hex) {
                this.renderer.setStyle(this.element, 'background', bg.solid.rgba);
            }
        } else if (bg.img) {
            if (!bg.img.src) {
                return;
            }

            const value = `url("${bg.img.src}") no-repeat center`;
            this.renderer.setStyle(this.element, 'background', value);
            this.renderer.setStyle(this.element, 'background-size', 'cover');

            if (bg.img.a) {
                this.renderer.setStyle(this.element, prefix + 'backdrop-filter', `opacity(${bg.img.a})`);
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
            let linearFunctionString = `linear-gradient(${grad.ang}deg, ${grad.c1}, ${grad.c2}`;

            if (grad.c3) {
                linearFunctionString += `, ${grad.c3}`;
            }

            if (grad.c4) {
                linearFunctionString += `, ${grad.c4}`;
            }

            if (grad.c5) {
                linearFunctionString += `, ${grad.c5}`;
            }

            linearFunctionString += `)`;
            const gradient = linearFunctionString;
            this.renderer.setStyle(this.element, attribute, gradient);
        }
    }

    /**
     * Process colour block of the element
     * @param {Color} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @private
     */
    protected processColourBlock(colour: Color, attribute = 'color'): void {
        if (!colour) {
            return;
        }

        if (colour.grad) {
            this.processGradient(colour.grad, attribute);
        } else if (colour.hex) {
            this.renderer.setStyle(this.element, attribute, colour.rgba);
        }
    }

}
