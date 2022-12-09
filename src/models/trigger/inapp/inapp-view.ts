import {BaseElement} from '../elements';
import {ContainerOrigin} from './in-app-trigger';

/**
 * Holds InApp customisation data
 *
 * @author Ashish Gaikwad
 * @since: 0.0.36
 */
export class InAppView extends BaseElement {

    gvt: ContainerOrigin;
    max: number;
    cover: boolean;

    constructor(data: Partial<InAppView>) {
        data = data ?? {};
        super(data);

        this.gvt = data.gvt ?? ContainerOrigin.C;
        this.max = data.max ?? 1200;
        this.cover = data.cover ?? true;
    }

}
