import {TextElement} from '../models/trigger/elements';
import {BlockProcessor} from './block-processor';
import {TextAlign, TextPart} from '../models/trigger/elements/text-element';
import {TriggerContext} from '../models/trigger/trigger-context';

/**
 * Base class for rendering any text extending block from in-app.
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export abstract class BaseTextRenderer extends BlockProcessor<TextElement> {

    protected constructor(parentElement: HTMLElement, inAppElement: TextElement, triggerContext: TriggerContext) {
        super(parentElement, inAppElement, triggerContext);
    }

    /**
     * Process all the common block in in-app.
     */
    protected processCommonBlocks(): void {
        super.processCommonBlocks();
        this.processFontBlock();
        this.processColourBlock(this.inappElement.color);
        this.processAlignment();
    }

    /**
     * Process font block of the element
     */
    protected processFontBlock(): void {
        this.renderer.setStyle(this.inappHTMLEl, 'letter-spacing', 'normal');
        const font = this.inappElement.font;
        if (!font) {
            return;
        }

        this.renderer.setStyle(this.inappHTMLEl, 'font-size', this.getSizePx(font.s));
        this.renderer.setStyle(this.inappHTMLEl, 'font-family', font.family?.name);
        this.renderer.setStyle(this.inappHTMLEl, 'line-height', font.lh);
    }

    protected processPart(partHTMLEl: HTMLSpanElement, part: TextPart): void {
        const decoration = [];
        if (part.u) decoration.push('underline');
        if (part.st) decoration.push('line-through');
        if (!decoration.length) decoration.push('normal');

        this.renderer.setStyle(partHTMLEl, 'font-weight', part.b ? 'bold' : 'normal');
        this.renderer.setStyle(partHTMLEl, 'font-style', part.i ? 'italic' : 'normal');
        this.renderer.setStyle(partHTMLEl, 'text-decoration', decoration.join(' '));
        this.renderer.setStyle(partHTMLEl, 'color', part.c ?? 'inherit');
        this.renderer.setStyle(partHTMLEl, 'font-family', 'inherit');
    }

    /**
     * Process text alignment block of the element
     * @private
     */
    protected processAlignment(): void {
        let value = TextAlign[this.inappElement.alg]?.toLowerCase();
        if (!value) value = 'start';
        this.renderer.setStyle(this.inappHTMLEl, 'text-align', value);
    }

}
