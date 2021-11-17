import {Renderer} from './renderer';
import {BaseElement} from '../models/trigger/elements';
import UAParser from 'ua-parser-js';
import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {Color, Gradient} from '../models/trigger/blocks';
import {getScalingFactor} from './index';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockProcessor<T extends BaseElement> {

    protected readonly renderer: Renderer;

    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;

    private scalingFactor: number = getScalingFactor();

    protected readonly parentHTMLEl: HTMLElement;
    protected readonly inappElement: T;
    protected inappHTMLEl: HTMLElement;

    /**
     * Constructor
     */
    protected constructor(parentHTMLEl: HTMLElement, inappElement: T) {
        this.parentHTMLEl = parentHTMLEl;
        this.inappElement = inappElement;
        this.renderer = new Renderer();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();
    }

    getHTMLElement(): HTMLElement {
        return this.inappHTMLEl;
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     */
    protected processCommonBlocks(): void {
        this.processWidthAndHeight();
        this.processPositionBlock();
        this.processBorderBlock();
        this.processBackgroundBlock();
        this.processSpaceBlock();
        this.processTransformBlock();
        this.registerAction();

        this.renderer.setStyle(this.inappHTMLEl, 'overflow', 'visible');
        this.renderer.setStyle(this.inappHTMLEl, 'outline', 'none');
    }

    /**
     * Process width and height
     */
    private processWidthAndHeight(): void {
        this.renderer.setStyle(this.inappHTMLEl, 'box-sizing', 'border-box');

        if (this.inappElement.w) {
            this.renderer.setStyle(this.inappHTMLEl, 'width', this.getSizePx(this.inappElement.w));
        }

        if (this.inappElement.h) {
            this.renderer.setStyle(this.inappHTMLEl, 'height', this.getSizePx(this.inappElement.h));
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
     */
    private processPositionBlock(): void {
        if (!this.inappElement.x) {
            return;
        }

        this.renderer.setStyle(this.inappHTMLEl, 'position', 'absolute');
        if (this.inappElement.x) this.renderer.setStyle(this.inappHTMLEl, 'top', this.getSizePx(this.inappElement.y));
        if (this.inappElement.y) this.renderer.setStyle(this.inappHTMLEl, 'left', this.getSizePx(this.inappElement.x));
    }

    /**
     * Process border block of the element
     */
    private processBorderBlock(): void {
        const border = this.inappElement.br;
        if (!border) {
            return;
        }

        // Just to make sure radius is not a negative number
        if (border.radius && border.radius > 0) {
            this.renderer.setStyle(this.inappHTMLEl, 'border-radius', this.getSizePx(border.radius));
        }

        // Just to make sure width is not a negative number
        if (border.width && border.width > 0) {
            this.renderer.setStyle(this.inappHTMLEl, 'border-width', this.getSizePx(border.width));
            this.renderer.setStyle(this.inappHTMLEl, 'border-style', border.style?.toLowerCase());

            if (border.color) {
                this.processColourBlock(border.color, 'border-color');
            } else {
                this.renderer.setStyle(this.inappHTMLEl, 'border-color', 'black');
            }
        }
    }

    /**
     * Process space block of the element which include margin and padding.
     */
    private processSpaceBlock(): void {
        const space = this.inappElement.spc;
        if (!space) {
            return;
        }

        if (space.p) this.renderer.setStyle(this.inappHTMLEl, 'padding', this.getSizePx(space.p));
        if (space.pt) this.renderer.setStyle(this.inappHTMLEl, 'padding-top', this.getSizePx(space.pt));
        if (space.pb) this.renderer.setStyle(this.inappHTMLEl, 'padding-bottom', this.getSizePx(space.pb));
        if (space.pl) this.renderer.setStyle(this.inappHTMLEl, 'padding-left', this.getSizePx(space.pl));
        if (space.pr) this.renderer.setStyle(this.inappHTMLEl, 'padding-right', this.getSizePx(space.pr));

        this.renderer.setStyle(this.inappHTMLEl, 'margin', '0 !important');
    }

    /**
     * Process transform block of the element
     */
    private processTransformBlock(): void {
        const transform = this.inappElement.trf;
        if (!transform) {
            return;
        }

        if (transform.rotate) {
            this.renderer.setStyle(this.inappHTMLEl, 'transform', `rotate(${transform.rotate}deg)`);
        }
    }

    /**
     * Register click-to-action(CTA) block of the element
     */
    private registerAction(): void {
        const action = this.inappElement.clc;
        if (!action) {
            return;
        }

        this.inappHTMLEl.addEventListener('click', () => {
            new ClickActionExecutor(action).execute();
        });
    }

    /**
     * Process background block of the element
     */
    private processBackgroundBlock(): void {
        const bg = this.inappElement.bg;
        if (!bg) {
            return;
        }

        let prefix = '';
        if (new UAParser().getBrowser().name?.toLowerCase().includes('safari')) {
            prefix = '-webkit-';
        }

        if (bg.glossy) {
            this.renderer.setStyle(this.inappHTMLEl, prefix + 'backdrop-filter', `blur(${bg.glossy.radius}px)`);

            if (bg.glossy.color) {
                this.processColourBlock(bg.glossy.color, 'background');
            }
        } else if (bg.solid) {
            if (bg.solid.grad) {
                this.processGradient(bg.solid.grad, 'background');
            } else if (bg.solid.hex) {
                this.renderer.setStyle(this.inappHTMLEl, 'background', bg.solid.rgba);
            }
        } else if (bg.img) {
            if (!bg.img.src) {
                return;
            }

            const value = `url("${bg.img.src}") no-repeat center`;
            this.renderer.setStyle(this.inappHTMLEl, 'background', value);
            this.renderer.setStyle(this.inappHTMLEl, 'background-size', 'cover');

            if (bg.img.a) {
                this.renderer.setStyle(this.inappHTMLEl, prefix + 'backdrop-filter', `opacity(${bg.img.a})`);
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
            this.renderer.setStyle(this.inappHTMLEl, attribute, gradient);
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
            this.renderer.setStyle(this.inappHTMLEl, attribute, colour.rgba);
        }
    }

}
