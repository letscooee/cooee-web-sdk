import {BaseElement} from '../elements';
import {Desktop} from '../blocks/desktop';

export class Container extends BaseElement {

    /**
     * TODO: This is for backward compatibility (remove after 31st May 2023)
     * @deprecated
     */
    readonly desk?: Desktop;
    private readonly o: ContainerOrigin;

    constructor(data: Record<string, any>) {
        super(data);
        this.o = data.o ?? ContainerOrigin.C;
        this.desk = data.desk;

        // For backward compatibility
        this.w = this.w ?? 1080;
        this.h = this.h ?? 1920;
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
