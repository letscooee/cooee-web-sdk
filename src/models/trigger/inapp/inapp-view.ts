import {Constants} from '../../../constants';
import {ScreenPosition} from '../../../enums';
import {Spacing} from '../blocks';
import {Animation} from '../blocks/Animation';
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
    anim: Animation;
    embedded: string | undefined;
    position: ScreenPosition;

    constructor(data: Partial<InAppView>) {
        data = data ?? {};
        super(data);

        this.gvt = data.gvt ?? ContainerOrigin.C;
        this.max = data.max as number;
        this.cover = data.cover ?? true;
        this.anim = new Animation(data.anim);
        this.embedded = data.embedded;
        this.position = data.position ?? ScreenPosition.ABOVE_PAGE;

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
