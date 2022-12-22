import {BaseElement} from '../elements';
import {ContainerOrigin} from './in-app-trigger';
import {Spacing} from '../blocks';
import {Constants} from '../../../constants';

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
        this.max = data.max as number;
        this.cover = data.cover ?? true;

        if (!this.spc) {
            this.spc = new Spacing({
                pl: Constants.IN_APP_DEFAULT_PADDING,
                pr: Constants.IN_APP_DEFAULT_PADDING,
                pt: Constants.IN_APP_DEFAULT_PADDING,
                pb: Constants.IN_APP_DEFAULT_PADDING,
            });
        }
    }

}
