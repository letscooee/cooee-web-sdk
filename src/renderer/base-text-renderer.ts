import {BaseElement, BaseTextElement} from '../models/trigger/elements';
import {Font} from '../models/trigger/blocks';
import {BlockProcessor} from './block-processor';

/**
 * Base class for rendering any text extending block from in-app.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BaseTextRenderer extends BlockProcessor {

    abstract render(parent: HTMLElement, element: BaseElement | string | null): HTMLElement;

    /**
     * Process all the common block in in-app.
     * @param {HTMLElement} element element to be processed
     * @param {BaseElement} baseElement style and attributes data of the element
     */
    protected processCommonBlocks(element: HTMLElement, baseElement: BaseElement): void {
        super.processCommonBlocks(element, baseElement);

        const baseTextElement = baseElement as BaseTextElement;
        this.processFontBlock(baseTextElement.font);
        this.processTextAlignmentBlock(baseTextElement.alg);

        this.processColourBlock(baseTextElement.color);
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

        this.renderer.setStyle(this.element, 'font-size', this.getSizePx(font.s));
        this.renderer.setStyle(this.element, 'font-family', font.ff);
        this.renderer.setStyle(this.element, 'line-height', font.lh);
    }

    /**
     * Process text alignment block of the element
     * @param {number} alignment alignment data for the element
     * @private
     */
    protected processTextAlignmentBlock(alignment: number): void {
        let value: string;

        switch (alignment) {
            case 1: {
                value = 'center';
                break;
            }
            case 2: {
                value = 'end';
                break;
            }
            case 3: {
                value = 'justify';
                break;
            }
            default: {
                value = 'start';
            }
        }
        this.renderer.setStyle(this.element, 'text-align', value);
    }

}
