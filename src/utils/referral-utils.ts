import {URLBuilder} from '@letscooee/url-builder';
import {LocalStorageHelper} from './local-storage-helper';

/**
 * Track referrals like UTM parameters and referrers.
 *
 * @author Shashank Agrawal
 * @since 0.1.3
 */
export class ReferralUtils {

    private static readonly UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    static addReferralData(properties: Record<string, any>): void {
        Object.assign(properties, this.getUTMParams());

        if (document.referrer) {
            properties.referrer = document.referrer;
        }
    }

    private static getUTMParams(): Record<string, any> {
        let urlBuilder: URLBuilder;

        try {
            urlBuilder = new URLBuilder(location.href);
        } catch (e) {
            return {};
        }

        const params: Record<string, string | undefined> = {};
        this.UTM_PARAMS.forEach((key: string) => {
            const value = urlBuilder.getQueryParam(key);
            if (value) {
                params[key] = value;
            }
        });

        if (Object.keys(params).length) {
            LocalStorageHelper.setObject('utm_params', params);
            return params;
        } else {
            return LocalStorageHelper.getObject('utm_params');
        }
    }

}
