import {ClickAction} from '../blocks';
import {Constants} from '../../../constants';
import {IFrameRenderer, RootContainerRenderer} from '../../../renderer';
import {SafeHttpService} from '../../../services/safe-http-service';
import {Log} from '../../../utils/log';
import {Event} from '../../event/event';
import {Props} from '../../../types';
import {LocalStorageHelper} from '../../../utils/local-storage-helper';
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
        if (this.action.ext) {
            window.open(this.action.ext.u, '_blank')?.focus();
        }
    }

    /**
     * Performs in-app browser action i.e open url in <code>iFrame</code>
     */
    iabAction(): void {
        if (this.action.iab) {
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
        if (this.action.kv) {
            document.dispatchEvent(new CustomEvent('onCooeeCTA', {'detail': this.action.kv}));
        }
    }

    /**
     * Performs prompt action i.e. ask for permission for location and notification.
     */
    prompt(): void {
        const permission: string = this.action.prompt;
        if (!permission) {
            return;
        }
        // TODO test in mobile browsers
        if (permission === Permission.Location) {
            this.promptLocationPermission();
        }

        if (permission === Permission.Push) {
            this.promptPushNotificationPermission();
        }

        if (permission === Permission.Camera) {
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

        new RootContainerRenderer().removeInApp();

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
            Log.w('Navigator.share is not compatible with this browser');
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
            this.apiService.updateProfile({'coords': [position.coords.latitude, position.coords.longitude]});
            this.sendPermissionData();
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
            this.apiService.updateProfile({'perm': permissions});
        });
    }

}
