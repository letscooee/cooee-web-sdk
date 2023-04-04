// import {CartEvents} from './cart-events';
// import {PurchaseEvents} from './purchase-events';
import {CtaListener} from './cta-listener';
import {FetchOrderId} from './fetch-order-id';

declare global {
    interface Window {
        CooeeSDK: any;
        Shopify: any;
        cooeeShopifyScriptLoaded: boolean;
        disableLegacyCooeeScreenView: boolean;
        sendCooeeAddToCart: (item: Record<string, any>) => void;
        sendCooeeRemoveFromCart: (item: Record<string, any>) => void;
    }
}

// Prevent double loading
if (!window.cooeeShopifyScriptLoaded) {
    window.cooeeShopifyScriptLoaded = true;

    // new CartEvents().track();
    // new PurchaseEvents().track();
    new FetchOrderId().track();
    new CtaListener().listen();
}

/*(() => {
    function processItemOrItems(itemOrItems: Record<string, any> | Record<string, any>[]): Record<string, any>[] {
        if (!itemOrItems) {
            Log.error(`No item received to be sent`);
            return;
        }

        if (!Array.isArray(itemOrItems)) {
            itemOrItems = [itemOrItems];
        }

        const items = [];
        for (let item of (itemOrItems as Record<string, any>[])) {
            if (!item.id || !item.title) {
                Log.warn(`Invalid item received`, item);
                continue;
            }

            items.push({
                name: item.title,
                quantity: item.quantity ?? 1,
                id: item.product_id?.toString(),
                mID: item.product_id?.toString(),
                vID: item.id.toString(),
            });
        }

        if (!items.length) {
            return;
        }

        return items;
    }

    /!**
     * This method sends "Add To Cart" event via Cooee SDK.
     * @param items
     *!/
    window.sendCooeeAddToCart = function (items: Record<string, any> | Record<string, any>[]): void {
        items = processItemOrItems(items);
        if (!items) {
            return;
        }

        window.CooeeSDK.events.push([
            'Add To Cart',
            {
                items,
            },
        ]);
    };

    /!**
     * This method sends "Remove From Cart" event via Cooee SDK.
     * @param items
     *!/
    window.sendCooeeRemoveFromCart = function (items: Record<string, any> | Record<string, any>[]): void {
        items = processItemOrItems(items);
        if (!items) {
            return;
        }

        window.CooeeSDK.events.push([
            'Remove From Cart',
            {
                items,
            },
        ]);
    };
})();*/
