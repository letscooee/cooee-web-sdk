import {BlockRenderer} from './block-renderer';
import {BaseElement, BaseTextElement} from '../models/trigger/elements';
import {Alignment, Font} from '../models/trigger/blocks';

/**
 * Base class for rendering any text extending block from in-app.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BaseTextRenderer extends BlockRenderer {

    abstract render(parent: HTMLElement, element: BaseElement | string | null): HTMLElement;

    /**
     * Process all the common block in in-app.
     * @param {HTMLElement} el element to be processed
     * @param {BaseElement} baseElement style and attributes data of the element
     */
    protected commonRenderingFunction(el: HTMLElement, baseElement: BaseElement): void {
        super.commonRenderingFunction(el, baseElement);

        const baseTextElement = baseElement as BaseTextElement;
        this.processFontBlock(baseTextElement.font);
        this.processTextAlignmentBlock(baseTextElement.alignment);

        this.processColourBlock(baseTextElement.colour);
    }

    /**
     * Process font block of the element
     * @param {Font} font font data for the element
     * @private
     */
    protected processFontBlock(font: Font): void {
        if (!font) {
            return;
        }

        this.renderer.setStyle(this.element, 'font-size', font.size);
        this.renderer.setStyle(this.element, 'font-weight', font.weight);
        this.renderer.setStyle(this.element, 'font-family', font.family);
        this.renderer.setStyle(this.element, 'font-style', font.style);
        this.renderer.setStyle(this.element, 'line-height', font.lineHeight);
    }

    /**
     * Process text alignment block of the element
     * @param {Alignment} alignment alignment data for the element
     * @private
     */
    protected processTextAlignmentBlock(alignment: Alignment): void {
        if (!alignment) {
            return;
        }

        this.renderer.setStyle(this.element, 'text-align', alignment.align?.toLowerCase());
    }

}
