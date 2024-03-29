import {Props} from '../../types';
import {Constants} from '../../constants';

/**
 * This class is used in sending request body for the first time to get sdkToken from server
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class DeviceAuthRequest {

    readonly sdk: string = Constants.SDK;

    /**
     * Public constructor
     *
     * @param {string} appID provided to the client.
     * @param shopifyShop
     * @param {string} uuid UUID of the device/browser.
     * @param {Props} props Different properties collected by SDK.
     */
    constructor(
        readonly appID: string | undefined,
        readonly shopifyShop: string | undefined,
        readonly uuid: string,
        readonly props: Props,
    ) {
    }

}
