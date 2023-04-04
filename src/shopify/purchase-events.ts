/**
 * Utility class to track purchase events on the "Thank You" page of Shopify.
 *
 * @author Abhishek Taparia
 */
export class PurchaseEvents {

    track(): void {
        if (!this.pageNavigated() || !location.pathname.includes('/checkouts/')
            || !location.pathname.includes('thank_you')) {
            return;
        }

        window.disableLegacyCooeeScreenView = true;
        window.CooeeSDK = window.CooeeSDK || {
            events: [],
            profile: [],
            account: [],
            screen: [],
            routes: {cart: {}},
            sendShopifyPastOrders: Function,
        };

        if (!window.CooeeSDK.routes) {
            window.CooeeSDK.routes = {cart: {}};
        }

        if (!window.CooeeSDK.sendShopifyPastOrders) {
            window.CooeeSDK.sendShopifyPastOrders = Function;
        }

        window.CooeeSDK.screen = ['thank_you'];

        const checkout: Record<string, any> = window.Shopify.checkout;

        const amount = {
            currency: checkout.currency,
            value: parseFloat(checkout.total_price),
        };

        const items = [];
        for (const lineItem of checkout.line_items) {
            const item = {
                id: lineItem.product_id.toString(),
                mID: lineItem.product_id.toString(),
                vID: lineItem.variant_id.toString(),
                name: lineItem.title,
                quantity: lineItem.quantity,
                price: lineItem.final_price,
            };

            items.push(item);
        }

        const coupon = this.getDiscountFormat(checkout.discount);

        const props = {
            amount,
            items,
            coupon,
            transactionID: checkout.order_id?.toString() ?? checkout.id?.toString(),
            attrs: checkout.attributes,
            bAddr: this.getAddressFormat(checkout.billing_address),
            sAddr: this.getAddressFormat(checkout.shipping_address),
            taxes: this.getTaxesFormat(checkout.tax_lines),
            note: checkout.note,
            totTax: checkout.tax_price,
            totDis: checkout.total_discounts,
        };

        window.CooeeSDK.events.push(['Purchase', props]);

        if (checkout.email) {
            window.CooeeSDK.profile.push({
                email: checkout.email,
            });
        }

        if (checkout.customer) {
            this.pushProfile(checkout.customer);
        } else if (checkout.billing_address) {
            this.pushProfile(checkout.billing_address);
        }
    }

    /**
     * Checks if page is reloaded or refreshed. In mobile browser if we kill the browser app when the page is loaded
     * and then open the browser app again, it does a page reload and not refresh. But with reload all the
     * javascript are loaded again which need to be prevented.
     *
     * https://stackoverflow.com/questions/5004978/check-if-page-gets-reloaded-or-refreshed-in-javascript/53307588#53307588
     *
     * @private
     * @return true, if page is reloaded.
     */
    private pageNavigated(): boolean {
        // Because of uncertainty of the code adding try-catch
        try {
            return window.performance
                .getEntriesByType('navigation')
                .map((nav: any) => nav.type)
                .includes('navigate');
        } catch (e) {
            return true;
        }
    };


    private pushProfile(profile: Record<string, any>): void {
        window.CooeeSDK.profile.push({
            mobile: profile.phone,
            name: profile.name || (profile.first_name.concat(' ', profile.last_name)),
        });
    }

    // noinspection JSMethodCanBeStatic
    private getAddressFormat(shopifyAddress: Record<string, any>) {
        if (!shopifyAddress) {
            return;
        }

        return {
            l1: shopifyAddress.address1,
            l2: shopifyAddress.address2,
            city: shopifyAddress.city,
            cntr: shopifyAddress.country,
            name: shopifyAddress.first_name.concat(' ', shopifyAddress.last_name),
            cc: shopifyAddress.country_code,
            state: shopifyAddress.province,
            sc: shopifyAddress.province_code,
            zip: shopifyAddress.zip,
        };
    }

    private getTaxesFormat(shopifyTaxes: Record<string, any>[]) {
        const taxes: Record<string, any>[] = [];

        shopifyTaxes?.forEach((tax) => {
            taxes.push({
                title: tax.title,
                rate: tax.rate,
                price: tax.price,
            });
        });

        return taxes;
    }

    private getDiscountFormat(discount: Record<string, any>) {
        if (!discount) {
            return undefined;
        }

        return {
            code: discount.code,
            amount: parseFloat(discount.amount),
        };
    }

}
