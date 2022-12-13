import {ClickActionExecutor} from '../models/trigger/action/click-action-executor';
import {Color, Gradient, Transform} from '../models/trigger/blocks';
import {BaseElement} from '../models/trigger/elements';
import {Container} from '../models/trigger/inapp/container';
import {Renderer} from './renderer';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Process all the block of in-app
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BlockProcessor<T extends BaseElement> {

    protected readonly renderer: Renderer = Renderer.get();
    protected readonly parentHTMLEl: HTMLElement;
    protected readonly inappElement: T;

    protected inappHTMLEl: HTMLElement;
    protected readonly triggerContext: TriggerContext;
    private readonly screenWidth: number = 0;
    private readonly screenHeight: number = 0;
    private readonly scalingFactor: number;

    protected constructor(parentHTMLEl: HTMLElement, inappElement: T, triggerContext: TriggerContext) {
        this.parentHTMLEl = parentHTMLEl;
        this.inappElement = inappElement;
        this.triggerContext = triggerContext;
        this.scalingFactor = this.renderer.getScalingFactor();

        this.screenWidth = this.renderer.getWidth();
        this.screenHeight = this.renderer.getHeight();
    }

    abstract render(): void;

    getHTMLElement(): HTMLElement {
        return this.inappHTMLEl;
    }

    protected insertElement(): void {
        this.renderer.appendChild(this.parentHTMLEl, this.inappHTMLEl);
    }

    /**
     * Process all the common blocks that can be placed in layer and container
     */
    protected processCommonBlocks(): void {
        this.processDisplay();
        this.processWidthAndHeight();
        this.processPositionBlock();
        this.processBorderBlock();
        this.processBackgroundBlock();
        this.processSpaceBlock();
        this.processTransformBlock();
        this.processTransparency();
        this.processShadow();
        this.registerAction();

        this.renderer.setStyle(this.inappHTMLEl, 'box-sizing', 'border-box');
        this.renderer.setStyle(this.inappHTMLEl, 'outline', 'none');
    }

    protected processDisplay(): void {
        this.renderer.setStyle(this.inappHTMLEl, 'display', 'block');
    }

    /**
     * Process width and height
     */
    protected processWidthAndHeight(): void {
        if (this.inappElement.w) {
            this.renderer.setStyle(this.inappHTMLEl, 'width', this.getSizePx(this.inappElement.w));
        }

        if (this.inappElement.h) {
            this.renderer.setStyle(this.inappHTMLEl, 'height', this.getSizePx(this.inappElement.h));
        }
    }

    /**
     * Get calculated size according to the device by multiplying it with scaling factor.
     * @param value size passed in payload
     * @return number calculated size
     */
    protected getSizePx(value: number): string {
        return this.getScaledSize(value) + 'px';
    }

    protected getScaledSize(value: number): number {
        return value * this.scalingFactor;
    }

    /**
     * Process position block of the element
     */
    protected processPositionBlock(): void {
        this.renderer.setStyle(this.inappHTMLEl, 'position', 'absolute');
        if (this.inappElement.x) this.renderer.setStyle(this.inappHTMLEl, 'left', this.getSizePx(this.inappElement.x));
        if (this.inappElement.y) this.renderer.setStyle(this.inappHTMLEl, 'top', this.getSizePx(this.inappElement.y));
    }

    /**
     * Process border block of the element
     */
    protected processBorderBlock(): void {
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
    protected processSpaceBlock(): void {
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

    protected processTransparency(): void {
        const transparency = this.inappElement.alpha;

        if (!isNaN(transparency)) {
            const opacity = (transparency / 100).toFixed(2);
            this.renderer.setStyle(this.inappHTMLEl, 'opacity', opacity);
        }
    }

    protected processShadow(): void {
        const shadow = this.inappElement.shd;

        if (shadow) {
            this.renderer.setStyle(this.inappHTMLEl, 'box-shadow', shadow.getStyle(this.scalingFactor));
        }
    }

    /**
     * Process transform block of the element
     */
    protected processTransformBlock(): void {
        const transform = new Transform(this.inappElement.trf);
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
    protected registerAction(): void {
        const action = this.inappElement.clc;
        if (!action || Object.keys(action).length === 0) {
            return;
        }

        this.inappHTMLEl.addEventListener('click', (event) => {
            event.stopPropagation();
            new ClickActionExecutor(action, this.triggerContext).execute();
        });

        if (!(this.inappElement instanceof Container)) {
            this.renderer.setStyle(this.inappHTMLEl, 'cursor', `pointer`);
        } else if (!(Object.keys(action).length === 1 && action.close !== undefined && action.close !== null)) {
            this.renderer.setStyle(this.inappHTMLEl, 'cursor', `pointer`);
        }
    }

    /**
     * Process background block of the element
     */
    protected processBackgroundBlock(): void {
        const bg = this.inappElement.bg;
        if (!bg) {
            return;
        }

        const htmlElement = this.inappHTMLEl;

        if (bg.glossy) {
            const styleName = 'backdrop-filter';
            const webkitStyleName = '-webkit-' + styleName;
            const styleValue = `blur(${bg.glossy.radius}px)`;

            if (!CSS.supports(webkitStyleName, styleValue) && !CSS.supports(styleName, styleValue)) {
                this.renderer.setStyle(htmlElement, 'background', bg.glossy.fallback!.rgba);
                return;
            }

            // Style for Apple devices
            this.renderer.setStyle(htmlElement, webkitStyleName, styleValue);

            // Style for other devices
            this.renderer.setStyle(htmlElement, styleName, styleValue);

            if (bg.glossy.color) {
                this.processColourBlock(bg.glossy.color, 'background', htmlElement);
            }
        } else if (bg.solid) {
            if (bg.solid.grad) {
                this.processGradient(bg.solid.grad, 'background');
            } else if (bg.solid.hex) {
                this.renderer.setStyle(htmlElement, 'background', bg.solid.rgba);
            }
        } else if (bg.img) {
            if (!bg.img.src) {
                return;
            }

            const value = `url("${bg.img.src}") no-repeat center`;
            this.renderer.setStyle(htmlElement, 'background', value);
            this.renderer.setStyle(htmlElement, 'background-size', 'cover');

            if (bg.img.a) {
                // Style for Apple devices
                this.renderer.setStyle(htmlElement, '-webkit-backdrop-filter', `opacity(${bg.img.a})`);

                // Style for other devices
                this.renderer.setStyle(htmlElement, 'backdrop-filter', `opacity(${bg.img.a})`);
            }
        }
    }

    /**
     * Process linear gradient and add to the element
     * @param {Gradient} grad gradient value
     * @param {string} attribute attribute on which gradient needs to be applied
     * @private
     */
    protected processGradient(grad: Gradient, attribute: string): void {
        if (grad.type === 'LINEAR') {
            let linearFunctionString = `linear-gradient(${grad.ang}deg, ${grad.c1}, ${grad.c2}`;

            if (grad.c3) {
                linearFunctionString += `, ${grad.c3}`;
            }

            linearFunctionString += `)`;
            this.renderer.setStyle(this.inappHTMLEl, attribute, linearFunctionString);
        }
    }

    /**
     * Process colour block of the element
     * @param {Color} colour colour data of the element
     * @param {string} attribute attribute on which colour data need to be applied
     * @param {HTMLElement} element Any other element to apply the color apart from {@link inappHTMLEl}
     * @private
     */
    protected processColourBlock(colour: Color, attribute = 'color', element = this.inappHTMLEl): void {
        if (!colour) {
            return;
        }

        if (colour.grad) {
            this.processGradient(colour.grad, attribute);
        } else if (colour.hex) {
            this.renderer.setStyle(element, attribute, colour.rgba);
        }
    }

}
