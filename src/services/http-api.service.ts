import {Event} from '../models/event/event';
import {Constants} from '../constants';
import {DeviceAuthRequest} from '../models/auth/device-auth-request';
import {Log} from '../utils/log';
import {Props} from '../types';
import {RuntimeData} from '../utils/runtime-data';
import {EventResponse} from '../models/event/event-response';
import {InAppRenderer} from '../renderer/in-app-renderer';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {TriggerHelper} from '../models/trigger/trigger-helper';
import {EmbeddedTrigger} from '../models/trigger/embedded-trigger';

/**
 * A base or lower level HTTP service which simply hits the backend for given request.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class HttpAPIService {

    private static readonly INSTANCE = new HttpAPIService();

    private readonly runtimeData = RuntimeData.getInstance();

    private apiToken: string = '';
    private userID: string = '';

    /**
     * Private constructor to make this class singleton.
     * @private
     */
    private constructor() {
        // This class is singleton
    }

    /**
     * Get instance of the class.
     *
     * @return {HttpAPIService}
     */
    public static getInstance(): HttpAPIService {
        return this.INSTANCE;
    }

    /**
     * Make server call and reject promise if the response code is non 2xx.
     *
     * @param method The HTTP method to invoke.
     * @param url URL to invoke.
     * @param body The JSON body for the request.
     * @param headers Custom headers to pass.
     * @private
     * @return The responded data <code>T</code> if successful.
     * @see https://stackoverflow.com/a/66713599/2405040
     */
    private async doHTTP<T>(method: string, url: string, body: any, headers: Headers): Promise<T> {
        if (!url.startsWith('http')) {
            url = Constants.API_URL + url;
        }

        const browserSupportsKeepalive = 'keepalive' in new Request('');

        if (!browserSupportsKeepalive && JSON.stringify(body).includes('CE App Background')) {
            const xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open('POST', url, false);
            headers.forEach((value, key) => {
                xmlHttpRequest.setRequestHeader(key, value);
            });
            xmlHttpRequest.send(JSON.stringify(body));

            return xmlHttpRequest.response.json();
        }

        const response = await fetch(url, {method, body: JSON.stringify(body), headers, keepalive: true});
        if (!response.ok) {
            throw response;
        }

        return response.json();
    }

    /**
     * Async call for registering device by making a call to backend
     *
     * @param {DeviceAuthRequest} userAuthRequest contains credentials
     */
    async registerDevice(userAuthRequest: DeviceAuthRequest): Promise<any> {
        return this.doHTTP('POST', '/v1/device/validate', userAuthRequest, this.getDefaultHeaders());
    }

    /**
     * Create/Send event call to the server.
     *
     * @param {Event} event event to be sent
     */
    sendEvent(event: Event): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', this.apiToken);

        event.activeTriggers = TriggerHelper.getActiveTriggers();

        const trigger: EmbeddedTrigger = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGER);

        if (trigger) {
            event.trigger = trigger;
            if (trigger.triggerID === 'test') {
                return;
            }
        }

        this.doHTTP<EventResponse>('POST', '/v1/event/track', event, headers)
            .then((data: EventResponse) => {
                Log.log('Sent', event.name);

                if (data.triggerData) {
                    new InAppRenderer().render(data.triggerData);
                }
            })
            .catch((error) => {
                Log.error('Error sending event', error);
            });
    }

    /**
     * Send shopify past order data to the server.
     *
     * @param {Record[]} pastOrdersData past order data of the user
     * @param {Record} properties additional properties
     */
    sendShopifyEvents(pastOrdersData: Record<string, any>[]): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', this.apiToken);

        const body = {pastOrdersData};

        this.doHTTP<EventResponse>('POST', '/v1/event/trackShopify', body, headers)
            .then(() => {
                Log.log('Sent Past Orders');
                LocalStorageHelper.setBoolean(Constants.STORAGE_SHOPIFY_PAST_ORDERS_DATA_SENT, true);
            })
            .catch((error) => {
                Log.error('Error sending event', error);
            });
    }

    /**
     * Create/Send user data/property call to the server.
     *
     * @param {Props} data user data and property.
     */
    updateUserData(data: Props): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', this.apiToken);

        this.doHTTP('PUT', '/v1/user/update', data, headers)
            .then(() => {
                Log.log('Updated user profile');
            })
            .catch((error) => {
                Log.error('Error saving user profile', error);
            });
    }

    /**
     * Create/Send device property call to the server.
     *
     * @param {Props} data device property.
     */
    updateDeviceProps(data: Props): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', this.apiToken);

        this.doHTTP('PUT', '/v1/device/update', data, headers)
            .then(() => {
                Log.log('Updated device property');
            })
            .catch((error) => {
                Log.error('Error saving device property', error);
            });
    }

    /**
     * Send conclude session events.
     *
     * @param {Props} data conclude session event properties
     */
    concludeSession(data: Props): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', this.apiToken);

        this.doHTTP('POST', '/v1/session/conclude', data, headers)
            .then((json) => {
                Log.log('Conclude Session', json);
            })
            .catch((error) => {
                Log.error(error);
            });
    }

    /**
     * Get all the default headers for the http calls.
     *
     * @private
     * @return {Headers} required headers
     */
    private getDefaultHeaders(): Headers {
        const headers = new Headers();

        headers.set('sdk-version', Constants.SDK_VERSION);
        headers.set('sdk-version-code', Constants.SDK_VERSION_CODE.toString());
        headers.set('app-version', this.runtimeData.getWebAppVersion());
        headers.set('user-id', this.userID);

        if (Constants.SDK_DEBUG) {
            headers.set('sdk-debug', String(1));
        }

        if (this.runtimeData.isDebugWebApp()) {
            headers.set('app-debug', String(1));
        }

        return headers;
    }

    /**
     * Set sdk token for headers.
     *
     * @param {string} token
     */
    setAPIToken(token: string): void {
        this.apiToken = token ?? '';
    }

    /**
     * Set user id for headers.
     *
     * @param {string} id
     */
    setUserId(id: string): void {
        this.userID = id ?? '';
    }

}
