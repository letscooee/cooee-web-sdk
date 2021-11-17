import {Container} from './container';
import {BaseElement, ImageElement, ShapeElement, TextElement} from '../elements';
import {ElementType} from '../elements/base-element';

/**
 * Stores data present in ian (In App) block in {@link TriggerData}
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppTrigger {

    cont: Container;
    elems: BaseElement[] = [];

    constructor(data: Record<string, any>) {
        this.cont = new Container(data.cont);

        data.elems.forEach((rawElement: Record<string, any>) => {
            if (rawElement.t === ElementType.IMAGE) {
                this.elems.push(new ImageElement(rawElement));
            } else if (rawElement.t === ElementType.TEXT) {
                this.elems.push(new TextElement(rawElement));
            } else if (rawElement.t === ElementType.BUTTON) {
                this.elems.push(new TextElement(rawElement));
            } else if (rawElement.t === ElementType.SHAPE) {
                this.elems.push(new ShapeElement(rawElement));
            }
        });
    }

}
