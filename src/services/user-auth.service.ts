/**
 * Service that deals with the user/device authentication.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
import {Device} from '../models/device/device';
import {HttpAPIService} from './http-api.service';
import {UserAuthRequest} from '../models/auth/user-auth-request';
import {DevicePropertiesCollector} from '../device/properties-collector';
import {Constants} from '../constants';
import {UserAuthResponse} from '../models/auth/user-auth-response';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import ObjectID from 'bson-objectid';
import {Log} from '../utils/log';

/**
 * Utility class to register user with server and to provide related data
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class UserAuthService {

    private apiService: HttpAPIService;

    private sdkToken: string;
    private userID: string;
    private appID: string;
    private appSecret: string;

    /**
     * Public constructor
     */
    constructor() {
        this.apiService = new HttpAPIService();
        this.sdkToken = '';
        this.userID = '';
        this.appID = '';
        this.appSecret = '';
    }

    /**
     * Initialize the service with credentials to be sent on http call.
     *
     * @param {string} appID provided to client
     * @param {string} appSecret provided to client
     * @return {Promise} to confirm token is fetched
     */
    init(appID: string, appSecret: string): Promise<void> {
        this.appID = appID;
        this.appSecret = appSecret;

        return this.acquireSDKToken();
    }

    /**
     * Check if localstorage has sdk token
     *
     * @return {boolean} true, if token is there in local storage
     */
    hasToken(): boolean {
        return !!LocalStorageHelper.getString(Constants.STORAGE_SDK_TOKEN, '');
    }

    /**
     * Return User ID.
     *
     * @return {string} user id
     */
    getUserID(): string {
        return this.userID;
    }

    /**
     * This method will pull user data (like SDK token & user ID) from the local storage
     * and populates it for further use.
     */
    private async populateUserDataFromStorage(): Promise<void> {
        this.sdkToken = LocalStorageHelper.getString(Constants.STORAGE_SDK_TOKEN, '');
        if (!this.sdkToken) {
            Log.l('No SDK token found in local storage');
        }

        this.userID = LocalStorageHelper.getString(Constants.STORAGE_USER_ID, '');
        if (!this.userID) {
            Log.l('No user ID found in local storage');
        }

        this.updateAPIClient();
    }

    /**
     * Update variable for http call.
     *
     * @private
     */
    private updateAPIClient(): void {
        Log.l('SDK Token:', this.sdkToken);
        Log.l('User ID:', this.userID);

        HttpAPIService.setAPIToken(this.sdkToken);
        HttpAPIService.setUserId(this.userID);
    }

    /**
     * Method will ensure that the SDK has acquired the token.
     *
     * @return {Promise} to confirm token is fetched
     */
    async acquireSDKToken(): Promise<void> {
        if (this.hasToken()) {
            return this.populateUserDataFromStorage();
        }

        Log.l('Attempt to acquire SDK token');

        return this.getSDKTokenFromServer();
    }

    /**
     * Make user registration with server (if not already) and acquire a SDK token
     * which will be later used to authenticate other endpoints.
     *
     * @return {Promise} to confirm token is fetched
     */
    private async getSDKTokenFromServer(): Promise<void> {
        const userAuthRequest = await this.getUserAuthRequest();
        Log.l('User Auth Request', userAuthRequest);
        const responseJson = this.apiService.registerDevice(userAuthRequest);

        try {
            const data = await <Promise<UserAuthResponse>>responseJson;
            Log.l('Register Device Response', data);
            this.saveUserDataInStorage(data);
        } catch (error) {
            Log.e(error);
        }
    }

    /**
     * Save sdk token and user id to local storage and update for http calls.
     *
     * @param {UserAuthResponse} data contain user-id and token
     */
    saveUserDataInStorage(data: UserAuthResponse): void {
        this.sdkToken = data.sdkToken;
        this.userID = data.id;

        this.updateAPIClient();

        LocalStorageHelper.setString(Constants.STORAGE_SDK_TOKEN, this.sdkToken);
        LocalStorageHelper.setString(Constants.STORAGE_USER_ID, this.userID);
    }

    /**
     * Get user auth request object.
     */
    async getUserAuthRequest(): Promise<UserAuthRequest> {
        return new UserAuthRequest(
            this.appID,
            this.appSecret,
            await this.getDevice(),
        );
    }

    /**
     * Get device class object.
     */
    async getDevice(): Promise<Device> {
        const results = await new DevicePropertiesCollector().get();

        const os = this.getBackendCompatibleOSName(results.os.name);
        const osVersion = results.os.version;
        // TODO How to get app version and cooee sdk version?
        const appVersion = '0.0.1';
        const cooeeSdkVersion = '0.0.1';

        delete results.os;

        return new Device(
            os,
            cooeeSdkVersion,
            appVersion,
            osVersion,
            Constants.SDK,
            this.getOrCreateUUID(),
            results,
        );
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Get or Create UUID
     *
     * @return {string} device id
     * @private
     */
    private getOrCreateUUID(): string {
        let uuid: string = LocalStorageHelper.getString(Constants.UUID, '');

        if (!uuid) {
            uuid = new ObjectID().toHexString();
            LocalStorageHelper.setString(Constants.UUID, uuid);
        }

        return uuid;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Get backend required OS name
     *
     * @param {string} os operating system name
     * @return {string} backend compatible operating system name
     * @private
     */
    private getBackendCompatibleOSName(os: string): string {
        switch (os) {
            case 'Mac OS':
                return 'MAC_OS';
            case 'Android':
                return 'ANDROID';
            case 'iOS':
                return 'IOS';
            case 'Windows':
            case 'Win64':
            case 'Win32':
                return 'WINDOWS';
            case 'Ubuntu':
                return 'UBUNTU';
            default:
                return 'UNKNOWN';
        }
    }

}
