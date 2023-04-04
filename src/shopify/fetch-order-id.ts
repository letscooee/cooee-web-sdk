export class FetchOrderId {

    track(): void {
        const currentURL = new URL(location.href);
        if (!(currentURL.toString().includes('/orders/') && currentURL.searchParams.get('page') === 'thank_you')) {
            return;
        }

        window.disableLegacyCooeeScreenView = true;
        window.CooeeSDK = window.CooeeSDK || {
            events: [],
            profile: [],
            account: [],
            screen: [],
            routes: {cart: {}},
        };

        const orderID = window.Shopify?.checkout?.order_id;
        if (!orderID) {
            return;
        }

        window.CooeeSDK.profile.push({
            order: {
                id: orderID.toString(),
            },
        });
    }
}