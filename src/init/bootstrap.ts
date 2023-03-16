import {Constants} from '../constants';
import {Log} from '../utils/log';
import {CommonListeners} from './common-listeners';
import {ObjectMeddler} from './object-meddler';
import {VisibilityListener} from './visibility-listener';
import {ShopifyContext} from './shopify-context';

/**
 * A one time initializer class which initialises the SDK. This is used internally by the SDK
 * and should be quick.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class Bootstrap {

    static getAppIDFromScript(): string | null | undefined {
        const src = (document.currentScript as HTMLScriptElement)?.src;
        if (!src) {
            return;
        }

        return new URL(src).searchParams.get('appID');
    }

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
        ShopifyContext.sendCartToken();
        Log.configure();
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
        text += '📣 Boost your conversions\n';
        text += '📈 Increase purchases & repeat purchases\n';
        text += '🤖 AI-powered creative automation via an easy to use Canva style editor\n';
        text += '\n\n';
        text += `Learn more: https://www.letscooee.com\nCooee SDK: v${Constants.SDK_VERSION}`;

        console.group('%c 1-to-1 personalised engagement for ecommerce success powered by Cooee ', styles);
        console.log(`%c${text}`, 'font-size: 13px; line-height: 1.8;');
        console.groupEnd();
    }

}
