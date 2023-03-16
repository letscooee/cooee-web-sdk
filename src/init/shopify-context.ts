import {SafeHttpService} from '../services/safe-http-service';
import {LocalStorageHelper} from '../utils/local-storage-helper';
import {Constants} from '../constants';

export class ShopifyContext {

    static isShopify(): boolean {
        return !!window.Shopify;
    }

    static getShopName(): string | undefined {
        if (!this.isShopify()) {
            return;
        }

        return window.Shopify.shop?.split('.')?.[0];
    }

    static getScreenName(): string | undefined {
        if (!this.isShopify()) {
            return;
        }

        const path = new URL(window.location.href).pathname.slice(1);

        const screenName = path.split('/')[0];
        if (screenName === '') {
            return 'home';
        } else if (screenName === 'collections') {
            return 'collection';
        } else if (screenName === 'products') {
            return 'product';
        } else if (screenName === 'cart') {
            return 'cart';
        }
    }

    static async sendCartToken(): Promise<void> {
        if (!this.isShopify()) {
            return;
        }

        let data;
        try {
            data = await (await fetch('/cart.js')).json();
        } catch {
            return;
        }

        const storedToken = LocalStorageHelper.getString(Constants.STORAGE_SHOPIFY_CART_TOKEN);
        if (data?.token && data.items?.length && data.token != storedToken) {
            // Send to Device
            SafeHttpService.getInstance().updateDeviceProps(
                {},
                {token: data.token, items: data.items},
            );

            LocalStorageHelper.setString(Constants.STORAGE_SHOPIFY_CART_TOKEN, data.token);
        }
    }

}
