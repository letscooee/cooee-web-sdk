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
            return 'collections';
        } else if (screenName === 'products') {
            return 'products';
        } else if (screenName === 'cart') {
            return 'cart';
        }
    }

}
