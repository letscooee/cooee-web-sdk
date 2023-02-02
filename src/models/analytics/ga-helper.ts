import {Configurations} from '../app/configurations';
import {LocalStorageHelper} from '../../utils/local-storage-helper';
import {Constants} from '../../constants';
import {SafeHttpService} from '../../services/safe-http-service';

export class GAHelper {

    static async saveConfigurations(configurations: Configurations): Promise<void> {
        if (!configurations.gaMeasurementID || !configurations.gaEnabled) {
            return;
        }

        const existingMeasurementID = LocalStorageHelper.getString(Constants.STORAGE_GA_MEASUREMENT_ID, '');
        const existingEnabled = LocalStorageHelper.getBoolean(Constants.STORAGE_GA_ENABLED, false);

        if (existingEnabled !== configurations.gaEnabled || existingMeasurementID !== configurations.gaMeasurementID) {
            LocalStorageHelper.remove(Constants.STORAGE_GA_CLIENT_ID);

            LocalStorageHelper.setString(Constants.STORAGE_GA_MEASUREMENT_ID, configurations.gaMeasurementID);
            LocalStorageHelper.setBoolean(Constants.STORAGE_GA_ENABLED, configurations.gaEnabled);
            await this.sendClientID();
        }
    }

    private static async sendClientID(): Promise<void> {
        const existingEnabled = LocalStorageHelper.getBoolean(Constants.STORAGE_GA_ENABLED, false);
        if (!existingEnabled) {
            return;
        }

        const clientID = await this.getClientID();
        if (!clientID) {
            return;
        }

        SafeHttpService.getInstance().updateDeviceProps({gaClientID: clientID});
    }

    private static async getClientID(): Promise<string | undefined> {
        let clientID: string | undefined = LocalStorageHelper.getString(Constants.STORAGE_GA_CLIENT_ID);
        if (!clientID) {
            clientID = await this.getClientIDViaGTag();
        }

        if (!clientID) {
            return;
        }

        LocalStorageHelper.setString(Constants.STORAGE_GA_CLIENT_ID, clientID);
        return clientID;
    }

    private static getClientIDViaGTag(): Promise<string> | undefined {
        const measurementID = LocalStorageHelper.getString(Constants.STORAGE_GA_MEASUREMENT_ID, '');
        const enabled = LocalStorageHelper.getString(Constants.STORAGE_GA_MEASUREMENT_ID, '');
        if (!enabled || !measurementID || !window.gtag) {
            return;
        }

        return new Promise<string>((resolve) => {
            window.gtag('get', measurementID, 'client_id', (clientID: string) => {
                resolve(clientID);
            });
        });
    }

}
