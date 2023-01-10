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
        this.logBrand();
        new VisibilityListener().listen();
        // @ts-ignore
        if (!window['disableLegacyCooeeScreenView']) {
            new CommonListeners().listen();
        }
        new ObjectMeddler().meddle();
    }

    private logBrand(): void {
        const styles = `
            display: inline-block;
            font-size: 14px;
            background: linear-gradient(90deg, #d52dc8 25%, #2179e2 82%);
            color: white;
            padding: 4px;
            border-radius: 4px;
        `;

        let text = '\n';
        text += '📣 Engage every customer uniquely\n';
        text += '📈 Incremental increase in online sales\n';
        text += '🤖 AI-powered creative automation via a Canva style editor\n';
        text += '\n\n';
        text += 'Learn more: https://www.letscooee.com\n';

        console.group('%c 1-to-1 personalised notifications powered by Cooee ', styles);
        console.log(`%c${text}`, 'font-size: 13px; line-height: 1.8;');
        console.groupEnd();
    }

}
