import {BaseElement, ImageElement, ShapeElement, TextElement} from '../elements';
import {ElementType} from '../elements/base-element';
import {Container} from './container';
import {InAppView} from './inapp-view';

/**
 * Stores data present in ian (In App) block in {@link TriggerData}
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class InAppTrigger extends InAppView {

    cont: Container;
    elems: BaseElement[] = [];
    mob: InAppView;

    constructor(data: Record<string, any>) {
        data = data ?? {};
        // Only background is supported for in-apps
        super(data);
        this.cont = new Container(data.cont);
        this.mob = new InAppView(data.mob);

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

    overrideMobileData(): void {
        this.max = this.cont?.desk?.max ?? this.mob.max ?? this.max;
        this.cover = this.mob.cover ?? this.cover;
        this.gvt = this.mob.gvt ?? this.gvt;
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
