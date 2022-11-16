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
import {DeviceAuthResponse} from '../models/auth/device-auth-response';
import {SessionManager} from '../session/session-manager';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

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
     * @param headers Custom headers to pass.
     * @param body The JSON body for the request.
     * @private
     * @return The responded data <code>T</code> if successful.
     * @see https://stackoverflow.com/a/66713599/2405040
     */
    private async doHTTP<T>(method: HttpMethod, url: string, headers: Headers, body?: Record<string, any> | string)
        : Promise<T> {
        if (!url.startsWith('http')) {
            url = Constants.API_URL + url;
        }

        const browserSupportsKeepalive = 'keepalive' in new Request('');

        if (body && !browserSupportsKeepalive && JSON.stringify(body).includes('CE App Background')) {
            return this.performXMLHttpRequest<T>(url, headers, body);
        }

        const requestInit: RequestInit = {method, headers, keepalive: true};
        if (body) {
            requestInit.body = JSON.stringify(body);
        }

        const response = await fetch(url, requestInit);
        if (!response.ok) {
            throw response;
        }

        return response.json();
    }

    private performXMLHttpRequest<T>(url: string, headers: Headers, body: Record<string, any> | string): T {
        const xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', url, false);
        headers.forEach((value: string, key: string) => {
            xmlHttpRequest.setRequestHeader(key, value);
        });
        xmlHttpRequest.send(JSON.stringify(body));

        return xmlHttpRequest.response.json();
    }

    /**
     * Async call for registering device by making a call to backend
     *
     * @param {DeviceAuthRequest} userAuthRequest contains credentials
     */
    async registerDevice(userAuthRequest: DeviceAuthRequest): Promise<any> {
        return this.doHTTP('POST', '/v1/device/validate', this.getDefaultHeaders(), userAuthRequest);
    }

    /**
     * Create/Send event call to the server.
     *
     * @param {Event} event event to be sent
     */
    sendEvent(event: Event): void {
        const headers = this.getDefaultHeaders();

        event.activeTriggers = TriggerHelper.getActiveTriggers();

        const trigger = LocalStorageHelper.getObject(Constants.STORAGE_ACTIVE_TRIGGER) as EmbeddedTrigger;

        if (trigger) {
            event.trigger = trigger;
            if (trigger.triggerID === 'test') {
                return;
            }
        }

        this.doHTTP<EventResponse>('POST', '/v1/event/track', headers, event)
            .then((data: EventResponse) => {
                Log.log('Sent', event.name);

                if (data.triggerData) {
                    new InAppRenderer().render(data.triggerData);
                }

                if (data.userID && data.sdkToken) {
                    this.updateUserIDAndToken({userID: data.userID, sdkToken: data.sdkToken});
                }
            })
            .catch((error) => {
                Log.error('Error sending event', error);
            });
    }

    /**
     * Send shopify past order data to the server.
     *
     * @param pastOrdersData past order data of the user
     */
    sendPastOrders(pastOrdersData: Record<string, any>[]): void {
        const headers = this.getDefaultHeaders();

        const body = {pastOrdersData};

        this.doHTTP<EventResponse>('POST', '/v1/event/trackPastOrders', headers, body)
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

        this.doHTTP<DeviceAuthResponse>('PUT', '/v1/user/update', headers, data)
            .then((response: DeviceAuthResponse) => {
                Log.log('Updated user profile');
                this.updateUserIDAndToken(response);
            })
            .catch((error) => {
                Log.error('Error saving user profile', error);
            });
    }

    /**
     * Updates userID and sdkToken received as a response from calling /user/update api. This would help in merging
     * profile.
     * @param response
     */
    updateUserIDAndToken(response: DeviceAuthResponse): void {
        if (!Object.keys(response).length) {
            return;
        }

        if (response.userID) {
            this.setUserID(response.userID);
            LocalStorageHelper.setString(Constants.STORAGE_USER_ID, response.userID);
        }

        if (response.sdkToken) {
            this.setAPIToken(response.sdkToken);
            LocalStorageHelper.setString(Constants.STORAGE_SDK_TOKEN, response.sdkToken);
        }
    }

    /**
     * Create/Send device property call to the server.
     *
     * @param {Props} data device property.
     */
    updateDeviceProps(data: Props): void {
        const headers = this.getDefaultHeaders();

        this.doHTTP('PUT', '/v1/device/update', headers, data)
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

        this.doHTTP('POST', '/v1/session/conclude', headers, data)
            .then((json) => {
                Log.log('Conclude Session', json);
            })
            .catch((error) => {
                Log.error(error);
            });
    }

    logout(): void {
        const headers = this.getDefaultHeaders();

        this.doHTTP<DeviceAuthResponse>('GET', '/v1/user/logout', headers)
            .then((json) => {
                Log.log('User logged out');
                this.updateUserIDAndToken(json);
                SessionManager.getInstance().startNewSession();
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

        if (this.apiToken) {
            headers.append('x-sdk-token', this.apiToken);
        }

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
    setUserID(id: string): void {
        this.userID = id ?? '';
    }

}
