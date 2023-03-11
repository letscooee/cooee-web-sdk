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

        const currentURL = new URL(window.location.href);

        let path = '';
        if (currentURL.pathname[0] === '/') {
            path = currentURL.pathname.slice(1);
        }

        if (path === '') {
            return 'home';
        } else if (path.split('/')[0] === 'collections') {
            return 'collections';
        } else if (path.split('/')[0] === 'products') {
            return 'products';
        } else if (path.split('/')[0] === 'cart') {
            return 'cart';
        }
    }

    static {
        const shop = this.getShopName();
        if (shop) {
            window.CooeeSDK.account.push({shop});
        }
    }

}
