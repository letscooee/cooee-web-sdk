import {BaseElement} from '../elements';

export class Container extends BaseElement {

    private o: ContainerOrigin;

    constructor(data: Record<string, any>) {
        super(data);
        this.o = data.o ?? ContainerOrigin.C;
    }

    getStyles(): Record<string, any> {
        let styles: Record<string, any>;
        if (this.o === ContainerOrigin.NW) {
            styles = {
                top: 0,
                left: 0,
            };
        } else if (this.o === ContainerOrigin.N) {
            styles = {
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else if (this.o === ContainerOrigin.NE) {
            styles = {
                top: 0,
                right: 0,
            };
        } else if (this.o === ContainerOrigin.E) {
            styles = {
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
            };
        } else if (this.o === ContainerOrigin.SE) {
            styles = {
                bottom: 0,
                right: 0,
            };
        } else if (this.o === ContainerOrigin.S) {
            styles = {
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else if (this.o === ContainerOrigin.SW) {
            styles = {
                bottom: 0,
                left: 0,
            };
        } else if (this.o === ContainerOrigin.W) {
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
