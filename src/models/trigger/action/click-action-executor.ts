import {Constants} from '../../../constants';
import {IFrameRenderer} from '../../../renderer';
import {Renderer} from '../../../renderer/renderer';
import {SafeHttpService} from '../../../services/safe-http-service';
import {Props} from '../../../types';
import {LocalStorageHelper} from '../../../utils/local-storage-helper';
import {Log} from '../../../utils/log';
import {Event} from '../../event/event';
import {ClickAction} from '../blocks';
import {Permission} from '../blocks/click-action';

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
        this.gotoURLAction();
        this.upAction();
        this.kvAction();
        this.prompt();
        this.closeAction();
        this.shareAction();
    }

    /**
     * Performs external action where url is opened in new tab/window.
     */
    externalAction(): void {
        if (this.action.ext?.u) {
            window.open(this.action.ext.u, '_blank')?.focus();
        }
    }

    /**
     * Check of given string is valid URL and has valid protocol.
     *
     * @param url {string} value to be checked.
     * @return boolean Returns true if url is valid and has protocol.
     */
    isValidURL(url: string): boolean {
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
    gotoURLAction(): void {
        if (this.action.gu?.u) {
            let url: string = this.action.gu.u;

            if (!this.isValidURL(url)) {
                url = `//${url}`;
            }

            window.open(url, '_self');
        }
    }

    /**
     * Performs in-app browser action i.e open url in <code>iFrame</code>
     */
    iabAction(): void {
        if (this.action.iab?.u) {
            new IFrameRenderer().render(this.action.iab.u as string);
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
        const mergedKV = {...this.action.custKV, ...this.action.kv};
        document.dispatchEvent(new CustomEvent('onCooeeCTA', {'detail': mergedKV}));
    }

    /**
     * Performs prompt action i.e. ask for permission for location and notification.
     */
    prompt(): void {
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
    closeAction(): void {
        if (!this.action.close) {
            return;
        }

        Renderer.get().removeInApp();

        const startTime = LocalStorageHelper.getNumber(Constants.STORAGE_TRIGGER_START_TIME, new Date().getTime());
        const triggerID = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGER)?.triggerID;

        const diffInSeconds = (new Date().getTime() - startTime) / 1000;

        let closeBehaviour;
        if (this.action.ext || this.action.up || this.action.kv ||
            this.action.iab || this.action.pmpt || this.action.share) {
            closeBehaviour = 'CTA';
        } else {
            closeBehaviour = 'Close';
        }

        const eventProps: Props = {
            'triggerID': triggerID,
            'closeBehaviour': closeBehaviour,
            'duration': diffInSeconds,
        };
        this.apiService.sendEvent(new Event(Constants.EVENT_TRIGGER_CLOSED, eventProps));

        LocalStorageHelper.remove(Constants.STORAGE_TRIGGER_START_TIME);
    }

    /**
     * Performs share action i.e. share some url on CTA.
     */
    shareAction(): void {
        // Navigator.share only works in mobile browsers and with https urls.
        // {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share}
        if (!this.action.share) {
            return;
        }
        // TODO test in mobile browsers
        const share = navigator.share;

        if (!share) {
            Log.warning('Navigator.share is not compatible with this browser');
            return;
        }

        navigator.share({'text': this.action.share.text, 'title': 'Share'} as ShareData)
            .then((r) => console.log(r))
            .catch((e) => console.error(e));
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
            Log.warning('This browser does not support desktop notification');
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
