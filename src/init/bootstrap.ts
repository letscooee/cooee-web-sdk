import {CommonListeners} from './common-listeners';
import {ObjectMeddler} from './object-meddler';
import {VisibilityListener} from './visibility-listener';

/**
 * A one time initializer class which initialises the SDK. This is used internally by the SDK
 * and should be quick.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class Bootstrap {

    /**
     * Initialize the document/window level workers.
     */
    init(): void {
        new VisibilityListener().listen();
        // @ts-ignore
        if (!window['disableLegacyCooeeScreenView']) {
            new CommonListeners().listen();
        }
        new ObjectMeddler().meddle();
    }

}
