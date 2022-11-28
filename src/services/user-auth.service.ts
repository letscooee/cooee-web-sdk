import {HttpAPIService} from './http-api.service';
import {DeviceAuthRequest} from '../models/auth/device-auth-request';
import {DevicePropertiesCollector} from '../device/properties-collector';
import {Constants} from '../constants';
import {DeviceAuthResponse} from '../models/auth/device-auth-response';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Log} from '../utils/log';
import {ObjectId} from 'bson';

/**
 * Service that deals with the user/device authentication.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class UserAuthService {

    private static readonly INSTANCE = new UserAuthService();

    private readonly apiService = HttpAPIService.getInstance();

    private sdkToken: string = '';
    private userID: string = '';
    private appID: string = '';

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
     * @return {RuntimeData}
     */
    public static getInstance(): UserAuthService {
        return this.INSTANCE;
    }

    /**
     * Initialize the service with credentials to be sent on http call.
     *
     * @param {string} appID provided to client
     * @return {Promise} to confirm token is fetched
     */
    init(appID: string): Promise<void> {
        this.appID = appID;

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
            Log.log('No SDK token found in local storage');
        }

        this.userID = LocalStorageHelper.getString(Constants.STORAGE_USER_ID, '');
        if (!this.userID) {
            Log.log('No user ID found in local storage');
        }

        this.updateAPIClient();
    }

    /**
     * Update variable for http call.
     *
     * @private
     */
    private updateAPIClient(): void {
        Log.log('SDK Token:', this.sdkToken);
        Log.log('User ID:', this.userID);

        this.apiService.setAPIToken(this.sdkToken);
        this.apiService.setUserID(this.userID);
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

        Log.log('Attempt to acquire SDK token');

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
        const responseJson = this.apiService.registerDevice(userAuthRequest);

        try {
            const data = await <Promise<DeviceAuthResponse>>responseJson;
            Log.log('Register Device Response', data);
            this.saveUserDataInStorage(data);
        } catch (error) {
            Log.error(error);
            throw error;
        }
    }

    /**
     * Save sdk token and user id to local storage and update for http calls.
     *
     * @param {DeviceAuthResponse} data contain user-id and token
     */
    saveUserDataInStorage(data: DeviceAuthResponse): void {
        this.sdkToken = data.sdkToken;
        this.userID = data.userID;

        this.updateAPIClient();

        LocalStorageHelper.setString(Constants.STORAGE_SDK_TOKEN, this.sdkToken);
        LocalStorageHelper.setString(Constants.STORAGE_USER_ID, this.userID);
    }

    /**
     * Get user auth request object.
     */
    private async getUserAuthRequest(): Promise<DeviceAuthRequest> {
        const props = await new DevicePropertiesCollector().get();
        props['host'] = location.origin;

        return new DeviceAuthRequest(
            this.appID,
            this.getOrCreateUUID(),
            props,
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
        let uuid: string = LocalStorageHelper.getString(Constants.STORAGE_DEVICE_UUID, '');

        if (!uuid) {
            uuid = new ObjectId().toHexString();
            LocalStorageHelper.setString(Constants.STORAGE_DEVICE_UUID, uuid);
        }

        return uuid;
    }

}
