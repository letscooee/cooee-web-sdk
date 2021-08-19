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
     * @param {string} appID
     * @param {string} appSecret
     * @return {Promise}
     */
    init(appID: string, appSecret: string): Promise<boolean> {
        this.appID = appID;
        this.appSecret = appSecret;

        return this.acquireSDKToken();
    }

    /**
     * Check if localstorage has sdk token
     *
     * @return {boolean}
     */
    hasToken() {
        return LocalStorageHelper.getString(Constants.STORAGE_SDK_TOKEN, '');
    }

    /**
     * Return User ID.
     *
     * @return {string}
     */
    getUserID() {
        return this.userID;
    }

    /**
     * This method will pull user data (like SDK token & user ID) from the local storage
     * and populates it for further use.
     */
    populateUserDataFromStorage() {
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
    private updateAPIClient() {
        Log.l('SDK Token:', this.sdkToken);
        Log.l('User ID:', this.userID);

        HttpAPIService.setAPIToken(this.sdkToken);
        HttpAPIService.setUserId(this.userID);
    }

    /**
     * Method will ensure that the SDK has acquired the token.
     *
     * @return {Promise}
     */
    async acquireSDKToken(): Promise<boolean> {
        if (this.hasToken()) {
            this.populateUserDataFromStorage();
            return true;
        }

        Log.l('Attempt to acquire SDK token qqwqwe');

        return this.getSDKTokenFromServer();
    }

    /**
     * Make user registration with server (if not already) and acquire a SDK token
     * which will be later used to authenticate other endpoints.
     *
     * @return {Promise}
     */
    private async getSDKTokenFromServer(): Promise<boolean> {
        const userAuthRequest = await this.getUserAuthRequest();
        Log.l('User Auth Request', userAuthRequest);
        const responseJson = this.apiService.registerDevice(userAuthRequest);

        try {
            const data = await <Promise<UserAuthResponse>>responseJson;
            Log.l('Register Device Response', data);
            this.saveUserDataInStorage(data);
            return true;
        } catch (error) {
            Log.e(error);
            return false;
        }
    }

    /**
     * Save sdk token and user id to local storage and update for http calls.
     *
     * @param {UserAuthResponse} data
     */
    saveUserDataInStorage(data: UserAuthResponse) {
        this.sdkToken = data.sdkToken;
        this.userID = data.id;

        this.updateAPIClient();

        LocalStorageHelper.setString(Constants.STORAGE_SDK_TOKEN, this.sdkToken);
        LocalStorageHelper.setString(Constants.STORAGE_USER_ID, this.userID);
    }

    /**
     * Get user auth request object.
     */
    async getUserAuthRequest() {
        return new UserAuthRequest(
            this.appID,
            this.appSecret,
            await this.getDevice(),
        );
    }

    /**
     * Get device class object.
     */
    async getDevice() {
        const results = await new DevicePropertiesCollector().get();

        const os = results.os.name;
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
            this.getCreateUUID(),
            results,
        );

    }

    /**
     * Get or Create UUID
     *
     * @return {string}
     * @private
     */
    private getCreateUUID(): string {
        let uuid: string = LocalStorageHelper.getString(Constants.UUID, '');

        if (!uuid) {
            uuid = new ObjectID().toHexString();
            LocalStorageHelper.setString(Constants.UUID, uuid);
        }

        return uuid;
    }

}
