import '../css/index.css';
import {Log} from '../utils/log';

enum ActionType {
    VIEW_ITEM = 'VIEW_ITEM',
    ADD_TO_CART = 'ADD_TO_CART',
    APPLY_COUPON = 'APPLY_COUPON',
}

interface Item {
    id: string,
    mID: string, // Merchant ID
    vID: string, // Variant ID
    name: string,
    link: string,
    quantity: number
}

interface Coupon {
    id?: string,
    code?: string,
    amount?: number,
    discountType?: 'percent' | 'fixed_cart' | 'fixed_product',
}

export class CtaListener {

    listen(): void {
        document.addEventListener('onCooeeCTA', async (event: Event) => {
            await this.processEvent((event as CustomEvent<Record<string, any>>));
        }, false);
    }

    private async processEvent(event: CustomEvent): Promise<void> {
        const payload = event?.detail;
        if (!payload) {
            return;
        }

        const actionType: string = payload.actionType;
        if (!actionType) {
            return;
        }

        Log.log(`Performing ${actionType} action`);

        if (actionType === ActionType.VIEW_ITEM) {
            this.performViewItem(payload.item);
        } else if (actionType === ActionType.ADD_TO_CART) {
            await this.performAddToCart(payload.item);
        } else if (actionType === ActionType.APPLY_COUPON) {
            await this.performApplyCoupon(payload.coupon);
        }

    }

    // noinspection JSMethodCanBeStatic
    private performViewItem(item: Item): void {
        if (!item?.link) {
            return;
        }

        location.href = item.link;
    }

    // noinspection JSMethodCanBeStatic
    private async performAddToCart(item: Item): Promise<void> {
        if (!item) {
            return;
        }

        const addToCartRoute = window.CooeeSDK.routes.cart.add;

        const itemsBody = {
            items: [{
                id: +item.vID ?? +item.mID ?? +item.id,
                quantity: item.quantity ?? 1,
            }],
        };
        const body = JSON.stringify(itemsBody);

        try {
            const response = await fetch(addToCartRoute, {
                body,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                Log.log(`Added ${item?.name} to Cart`);

                // https://community.shopify.com/c/shopify-apis-and-sdks/how-do-i-refresh-the-cart-drawer-after-adding-an-item-to-cart/td-p/263694
                document.documentElement.dispatchEvent(
                    new CustomEvent('cart:refresh', {
                        bubbles: true, // This code is for prestige theme, is to refresh the cart
                    }),
                );
            }
        } catch (e) {
            Log.error('Failed to add product in cart', e);
        }
    }

    private async performApplyCoupon(coupon: Coupon): Promise<void> {
        if (!coupon?.code) {
            return;
        }

        try {
            await navigator.clipboard.writeText(coupon.code);
            Log.log(`Code-${coupon.code} copied`);

            const spanElement = document.createElement('span');
            spanElement.id = 'snackbar';
            spanElement.innerText = 'Copied';
            document.body.appendChild(spanElement);

            spanElement.className = 'show';
            setTimeout(() => {
                spanElement.classList.remove('show');
                document.body.removeChild(spanElement);
            }, 3000);
        } catch (e) {
            Log.error('Failed to copy code', e);
        }

    }

}
