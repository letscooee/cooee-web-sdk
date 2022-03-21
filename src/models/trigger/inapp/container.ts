import {BaseElement} from '../elements';

export class Container extends BaseElement {

    private o: ContainerOrigin;

    constructor(data: Record<string, any>) {
        super(data);
        this.o = data.o ?? ContainerOrigin.C;
    }

    getOrigin(): ContainerOrigin {
        return this.o;
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
