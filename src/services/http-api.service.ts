import {Event} from '../models/event/event';
import {Constants} from '../constants';
import {UserAuthRequest} from '../models/auth/user-auth-request';
import {SessionManager} from '../session/session-manager';
import {Log} from '../utils/log';
import {Props} from '../utils/type';

/**
 * A base or lower level HTTP service which simply hits the backend for given request.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class HttpAPIService {

    private static apiToken: string;
    private static userID: string;

    private sessionManager: SessionManager;

    /**
     * Public constructor
     */
    constructor() {
        this.sessionManager = SessionManager.getInstance();
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

        const response = await fetch(url, {method, body: JSON.stringify(body), headers});
        if (!response.ok) {
            throw response;
        }

        return response.json();
    }

    /**
     * Async call for registering device by making a call to backend
     *
     * @param {UserAuthRequest} userAuthRequest contains credentials
     */
    async registerDevice(userAuthRequest: UserAuthRequest): Promise<any> {
        return this.doHTTP('POST', '/v1/device/validate', userAuthRequest, this.getDefaultHeaders());
    }

    /**
     * Create/Send event call to the server.
     *
     * @param {Event} event event to be sent
     */
    sendEvent(event: Event): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        this.doHTTP('POST', '/v1/event/track', event, headers)
            .then((data) => {
                Log.l('Sent', event.name, 'with response', data);
            })
            .catch((error) => {
                Log.e(error);
            });
    }

    /**
     * Create/Send user data/property call to the server.
     *
     * @param {Props} data user data and property.
     */
    updateUserData(data: Props): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        this.doHTTP('POST', '/v1/user/update', data, headers)
            .then((data) => {
                Log.l('Sent User Data with response', data);
            })
            .catch((error) => {
                Log.e(error);
            });
    }

    /**
     * Send conclude session events.
     *
     * @param {Props} data conclude session event properties
     */
    concludeSession(data: Props): void {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        this.doHTTP('POST', '/v1/session/conclude', data, headers)
            .then((json) => {
                Log.l('Conclude Session', json);
            })
            .catch((error) => {
                Log.e(error);
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

        // TODO pull it dynamically from the release version
        headers.set('sdk-version', '1.0.0');
        headers.set('sdk-version-code', '1');

        headers.set('user-id', HttpAPIService.userID);

        // TODO add condition
        if (2 > 7) {
            headers.set('sdk-debug', String(1));
            headers.set('app-debug', String(1));
        }

        return headers;
    }

    /**
     * Set sdk token for headers.
     *
     * @param {string} token
     */
    static setAPIToken(token: string): void {
        HttpAPIService.apiToken = token;
    }

    /**
     * Set user id for headers.
     *
     * @param {string} id
     */
    static setUserId(id: string): void {
        HttpAPIService.userID = id;
    }

}
