import {IFrameRenderer} from '../../../renderer';
import {SafeHttpService} from '../../../services/safe-http-service';
import {CloseBehaviour, Props} from '../../../types';
import {Log} from '../../../utils/log';
import {ClickAction} from '../blocks';
import {ClickActionType, Permission} from '../blocks/click-action';
import {TriggerContext} from '../trigger-context';
import {TriggerHelper} from '../trigger-helper';

/**
 * Performs click to action on in-app elements
 *
 * @author Abhishek Taparia
 * @version 0.0.5
 */
export class ClickActionExecutor {

    protected readonly apiService: SafeHttpService;
    private readonly action: ClickAction;
    private readonly triggerContext: TriggerContext;

    /**
     * Constructor
     * @param {ClickAction} action action data
     * @param triggerContext
     */
    constructor(action: ClickAction, triggerContext: TriggerContext) {
        this.action = action;
        this.apiService = SafeHttpService.getInstance();
        this.triggerContext = triggerContext;
    }

    /**
     * Execute CTAs on element click event
     */
    execute(): void {
        this.closeAction();
        let mergedKV = this.action.custKV;

        switch (this.action.at) {
            case ClickActionType.EXTERNAL:
                this.externalAction();
                break;
            case ClickActionType.IAB:
                this.iabAction();
                break;
            case ClickActionType.SAME_TAB:
                this.gotoURLAction();
                break;
            case ClickActionType.SHARE:
                this.shareAction();
                break;
            case ClickActionType.PROMPT:
                this.prompt();
                break;
            case ClickActionType.KEY_VALUE:
            case ClickActionType.KV_ADD_TO_CART:
            case ClickActionType.KV_COUPON_CODE:
            case ClickActionType.KV_VIEW_CATEGORY:
            case ClickActionType.KV_VIEW_ITEM:
                mergedKV = {...mergedKV, ...this.action.kv};
                break;
            case undefined:
                break;
            default:
                // Stop execution of the CTA if this.action.at is invalid
                Log.error('Received an invalid ClickActionType: ', this.action.at);
                return;
        }

        /*
        For UP, custKV & close ClickActionType will always undefined. Also, custKV and close must run with all
        ClickActionType.
         */
        this.upAction();
        this.kvAction(mergedKV);
    }

    /**
     * Performs external action where url is opened in new tab/window.
     */
    private externalAction(): void {
        if (this.action.ext?.u) {
            let url: string = this.action.ext.u;

            if (!this.isValidURL(url)) {
                url = `//${url}`;
            }

            window.open(url, '_blank')?.focus();
        }
    }

    /**
     * Check of given string is valid URL and has valid protocol.
     *
     * @param url {string} value to be checked.
     * @return boolean Returns true if url is valid and has protocol.
     */
    private isValidURL(url: string): boolean {
        try {
            new URL(url);
        } catch (e) {
            return false;
        }

        return true;
    }

    /**
     * Opens URL in same tab by prepending protocol in the URL if not exist.
     */
    private gotoURLAction(): void {
        if (this.action.gu?.u) {
            let url: string = this.action.gu.u;

            if (!this.isValidURL(url)) {
                url = `//${url}`;
            }

            window.open(url, '_self');
        }
    }

    /**
     * Performs in-app browser action i.e. open url in <code>iFrame</code>
     */
    private iabAction(): void {
        if (this.action.iab?.u) {
            let url: string = this.action.iab.u;

            if (!this.isValidURL(url)) {
                url = `//${url}`;
            }

            new IFrameRenderer().render(url);
        }
    }

    /**
     * Performs up action i.e. sending user properties back to server.
     */
    private upAction(): void {
        if (this.action.up) {
            this.apiService.updateProfile(this.action.up);
        }
    }

    /**
     * Sends key-value pair to the application.
     * @param mergedKV KV to be sent on listener
     */
    private kvAction(mergedKV: Record<string, any> | undefined): void {
        document.dispatchEvent(new CustomEvent('onCooeeCTA', {'detail': mergedKV}));
    }

    /**
     * Performs prompt action i.e. ask for permission for location and notification.
     */
    private prompt(): void {
        const permission = this.action.pmpt;
        if (!permission) {
            return;
        }
        // TODO test in mobile browsers
        if (permission === Permission.LOCATION) {
            this.promptLocationPermission();
        }

        if (permission === Permission.PUSH) {
            this.promptPushNotificationPermission();
        }

        if (permission === Permission.CAMERA) {
            this.promptCameraPermission();
        }
    }

    /**
     * Performs close action
     */
    private closeAction(): void {
        let closeBehaviour: CloseBehaviour;
        if (this.containsCTA()) {
            closeBehaviour = 'CTA';
            TriggerHelper.storeActiveTrigger(this.triggerContext.triggerData);
        } else {
            closeBehaviour = 'Close';
        }

        if (this.action.close) {
            this.triggerContext.closeInApp(closeBehaviour);
        }
    }

    /**
     * Performs share action i.e. share some url on CTA.
     */
    private shareAction(): void {
        // Navigator.share only works in mobile browsers and with https urls.
        // {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share}
        if (!this.action.share) {
            return;
        }
        // TODO test in mobile browsers
        const share = navigator.share;

        if (!share) {
            Log.warn('Navigator.share is not compatible with this browser');
            return;
        }

        navigator.share({'text': this.action.share.text, 'title': 'Share'} as ShareData)
            .then((r) => console.log(r))
            .catch((e) => console.error(e));
    }

    /**
     * Checks of {@link ClickAction} contains CTA other than close.
     * @return {true} if CTA contains any other CTA other than close.
     * @private
     */
    private containsCTA(): boolean {
        /*
         * If this.action.at is present it means KV/EXT/IAB/GU/PMPT is present.
         * If this.action.at is not present we need to check for custKV and UP.
         */
        if (this.action.at) {
            return true;
        }

        return !(this.isEmpty(this.action.custKV) && this.isEmpty(this.action.up));
    }

    /**
     * Checks if given record is empty or not.
     * @param record Record need to checked.
     * @return {true} if record is not undefined and contains at least one key.
     * @private
     */
    private isEmpty(record: Record<string, any> | undefined): boolean {
        if (!record) {
            return true;
        }

        return Object.keys(record).length === 0;
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
            this.apiService.updateDeviceProps({'coords': [position.coords.latitude, position.coords.longitude]});
            this.sendPermissionData();
        });
    }

    /**
     * This prompts for the push notification permission from the user.
     * @private
     */
    private promptPushNotificationPermission(): void {
        if (!('Notification' in window)) {
            Log.warn('This browser does not support desktop notification');
            return;
        }

        // TODO Need device endpoints to update this property
        if (Notification.permission !== 'default') {
            this.apiService.updateDeviceProps({'pnPerm': Notification.permission});
            return;
        }

        Notification.requestPermission()
            .then(() => {
                this.sendPermissionData();
            });
    }

    /**
     * This prompts for the camera permission from the user.
     * @private
     */
    private promptCameraPermission(): void {
        if (!navigator.mediaDevices) {
            return;
        }

        navigator.mediaDevices.getUserMedia({video: true}).finally(() => {
            this.sendPermissionData();
        });
    }

    /**
     * Check for a permission
     * @param of permission of what
     * @private
     * @return permission state
     */
    private checkPermission(of: PermissionName): Promise<string> {
        return navigator.permissions.query({name: of})
            .then((permission: PermissionStatus) => {
                return permission.state.toString();
            });
    }

    /**
     * Check for all the permissions
     * @private
     */
    private async checkAllPermission(): Promise<Props> {
        // @ts-ignore
        const camera = await this.checkPermission('camera');
        const location = await this.checkPermission('geolocation');
        const notification = Notification.permission;

        return {
            camera: camera,
            location: location,
            notification: notification,
        };
    }

    /**
     * Send permission data to device property
     * @private
     */
    private sendPermissionData(): void {
        this.checkAllPermission().then((permissions) => {
            this.apiService.updateDeviceProps({'perm': permissions});
        });
    }

}
