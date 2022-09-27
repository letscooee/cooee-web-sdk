import {BaseElement, ImageElement, ShapeElement, TextElement} from '../elements';
import {ElementType} from '../elements/base-element';
import {Container} from './container';

/**
 * Stores data present in ian (In App) block in {@link TriggerData}
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppTrigger extends BaseElement {

    cont: Container;
    elems: BaseElement[] = [];
    gvt: ContainerOrigin;
    readonly cover: boolean;

    constructor(data: Record<string, any>) {
        // Only background is supported for in-apps
        super({bg: data.bg});
        this.cont = new Container(data.cont);
        this.gvt = data.gvt;
        // Explicitly checking for "undefined" for backward compatibility for already running in-apps
        this.cover = data.cover === undefined ? true : data.cover;

        // Backward compatibility
        if (!this.bg) {
            this.bg = this.cont.bg;
            delete this.cont.bg;
        }

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

    getStyles(): Record<string, any> {
        let styles: Record<string, any>;
        if (this.gvt === ContainerOrigin.NW) {
            styles = {
                top: 0,
                left: 0,
            };
        } else if (this.gvt === ContainerOrigin.N) {
            styles = {
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else if (this.gvt === ContainerOrigin.NE) {
            styles = {
                top: 0,
                right: 0,
            };
        } else if (this.gvt === ContainerOrigin.E) {
            styles = {
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
            };
        } else if (this.gvt === ContainerOrigin.SE) {
            styles = {
                bottom: 0,
                right: 0,
            };
        } else if (this.gvt === ContainerOrigin.S) {
            styles = {
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else if (this.gvt === ContainerOrigin.SW) {
            styles = {
                bottom: 0,
                left: 0,
            };
        } else if (this.gvt === ContainerOrigin.W) {
            styles = {
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
            };
        } else {
            styles = {
                top: '50%',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
            };
        }

        styles.position = 'absolute';
        styles.overflow = 'hidden';
        return styles;
    }

}

export enum ContainerOrigin {

    NW = 1,
    N = 2,
    NE = 3,
    W = 4,
    C = 5,
    E = 6,
    SW = 7,
    S = 8,
    SE = 9

}
