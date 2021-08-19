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
     * Async call for registering device by making a call to backend
     *
     * @param {UserAuthRequest} userAuthRequest
     */
    async registerDevice(userAuthRequest: UserAuthRequest) {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(userAuthRequest),
            headers: this.getDefaultHeaders(),
        };

        const response = await fetch(Constants.API_URL + '/v1/device/validate', requestOptions);

        return response.json();
    }

    /**
     * Create/Send event call to the server.
     *
     * @param {Event} event
     */
    sendEvent(event: Event) {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(event),
            headers: headers,
        };

        fetch(Constants.API_URL + '/v1/event/track', requestOptions)
            .then((response) => response.json())
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
     * @param {Props} map user data and property.
     */
    updateUserData(map: Props) {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify(map),
            headers: headers,
        };

        fetch(Constants.API_URL + '/v1/user/update', requestOptions)
            .then((response) => response.json())
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
    concludeSession(data: Props) {
        const headers = this.getDefaultHeaders();
        headers.append('x-sdk-token', HttpAPIService.apiToken);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        };

        fetch(Constants.API_URL + '/v1/session/conclude', requestOptions)
            .then((response) => response.json())
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
     * @return {Headers}
     */
    private getDefaultHeaders(): Headers {
        const headers = new Headers();

        // TODO pull it dynamically from the release version
        headers.set('sdk-version', '1.0.0');
        headers.set('sdk-version-code', '1');

        headers.set('user-id', HttpAPIService.userID);

        // TODO add condition
        if (2 > 7) {
            headers.set('debug-sdk', String(1));
            headers.set('debug-app', String(1));
        }

        return headers;
    }

    /**
     * Set sdk token for headers.
     *
     * @param {string} token
     */
    static setAPIToken(token: string) {
        HttpAPIService.apiToken = token;
    }

    /**
     * Set user id for headers.
     *
     * @param {string} id
     */
    static setUserId(id: string) {
        HttpAPIService.userID = id;
    }

}
