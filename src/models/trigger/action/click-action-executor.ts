import {ClickAction} from '../blocks';
import {Renderer} from '../../../renderer/renderer';
import {Constants} from '../../../constants';
import {IFrameRenderer} from '../../../renderer/iFrame-renderer';
import {SafeHttpService} from '../../../services/safe-http-service';
import {Log} from '../../../utils/log';
import {Event} from '../../event/event';
import {Props} from '../../../types';
import {LocalStorageHelper} from '../../../utils/local-storage-helper';

/**
 * Performs click to action on in-app elements
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ClickActionExecutor {

    private readonly action: ClickAction;
    protected readonly apiService: SafeHttpService;

    /**
     * Constructor
     * @param {ClickAction} action action data
     */
    constructor(action: ClickAction) {
        this.action = action;
        this.apiService = SafeHttpService.getInstance();
    }

    /**
     * Execute CTAs on element click event
     */
    execute(): void {
        this.externalAction();
        this.iabAction();
        this.upAction();
        this.kvAction();
        this.prompts();
        this.closeAction();
        this.shareAction();
    }

    /**
     * Performs external action where url is opened in new tab/window.
     */
    externalAction(): void {
        if (this.action.external) {
            window.open(this.action.external.url, '_blank')?.focus();
        }
    }

    /**
     * Performs in-app browser action i.e open url in <code>iFrame</code>
     */
    iabAction(): void {
        if (this.action.iab) {
            new IFrameRenderer().render(this.action.iab.url as string);
        }
    }

    /**
     * Performs up action i.e. sending user properties back to server.
     */
    upAction(): void {
        if (this.action.up) {
            this.apiService.updateProfile(this.action.up);
        }
    }

    /**
     * Performs kv action i.e. send key-value pair to the application.
     */
    kvAction(): void {
        if (this.action.kv) {
            document.dispatchEvent(new CustomEvent('onCooeeCTA', {'detail': this.action.kv}));
        }
    }

    /**
     * Performs prompt action i.e. ask for permission for location and notification.
     */
    prompts(): void {
        if (this.action.prompts) {
            // TODO test in mobile browsers
            console.log('prompts', this.action.prompts);
            for (const permission of this.action.prompts) {
                if (permission === 'LOCATION') {
                    this.promptLocationPermission();
                }

                if (permission === 'PUSH') {
                    this.promptPushNotificationPermission();
                }
            }
        }
    }

    /**
     * Performs close action
     */
    closeAction(): void {
        if (this.action.close) {
            new Renderer().removeInApp();

            const startTime = LocalStorageHelper.getNumber(Constants.STORAGE_TRIGGER_START_TIME, new Date().getTime());
            const triggerID = LocalStorageHelper.getString(Constants.STORAGE_ACTIVE_TRIGGER_ID, '');

            const diffInSeconds = (new Date().getTime() - startTime) / 1000;

            const eventProps: Props = {
                'triggerID': triggerID,
                'Close Behaviour': 'CTA',
                'Duration': diffInSeconds,
            };
            this.apiService.sendEvent(new Event('CE Trigger Closed', eventProps));

            LocalStorageHelper.remove(Constants.STORAGE_TRIGGER_START_TIME);
            LocalStorageHelper.remove(Constants.STORAGE_ACTIVE_TRIGGER_ID);
        }
    }

    /**
     * Performs share action i.e. share some url on CTA.
     */
    shareAction(): void {
        // Navigator.share only works in mobile browsers and with https urls.
        // {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share}
        if (this.action.share) {
            // TODO test in mobile browsers
            const share = navigator.share;

            if (!share) {
                Log.w('Navigator.share is not compatible with this browser');
                return;
            }

            navigator.share({'text': this.action.share.text, 'title': 'Share'} as ShareData)
                .then((r) => console.log(r))
                .catch((e) => console.error(e));
        }
    }

    /**
     * This prompts for the location permission from the user and if granted sends <code>coords</code>
     * back to server as user properties.
     * @private
     */
    private promptLocationPermission(): void {
        if (!navigator.geolocation || !navigator.permissions) {
            return;
        }

        // TODO Need device endpoints to update this property
        navigator.geolocation.getCurrentPosition((position) => {
            this.apiService.updateProfile({'coords': [position.coords.latitude, position.coords.longitude]});
        });
    }

    /**
     * This prompts for the push notification permission from the user.
     * @private
     */
    private promptPushNotificationPermission(): void {
        if (!('Notification' in window)) {
            Log.w('This browser does not support desktop notification');
            return;
        }

        // TODO Need device endpoints to update this property
        if (Notification.permission !== 'default') {
            this.apiService.updateProfile({'pnPerm': Notification.permission});
            return;
        }

        Notification.requestPermission()
            .then((permission) => {
                this.apiService.updateProfile({'pnPerm': permission});
            });
    }

}
