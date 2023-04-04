// noinspection JSMethodCanBeStatic

import {Log} from '../utils/log';
import {CookieHelper} from './cookie-helper';

/**
 * This is a self executing function for identifying multiple Shopify Events for "Add To Cart" and "Remove from
 * Cart" and send it with proper format to Cooee Web SDK.
 */
export class CartEvents {

    cartItems: any[] = [];

    private readonly cookieHelper = new CookieHelper();
    private readonly COOKIE_NAME = 'cooeeAddToCartEvent';

    track(): void {
        // Do not block the execution
        // noinspection JSIgnoredPromiseFromCall
        this.fetchExistingCartItems();
        this.overwriteXMLHttpRequest();
        this.overwriteFetchMethod();
        this.addSubmitListener();
    }

    private async fetchExistingCartItems(): Promise<void> {
        await this.fetchCartItems();

        if (window.location.pathname !== '/cart') {
            return;
        }

        const cookieData = this.cookieHelper.getCookie(this.COOKIE_NAME);
        let savedProductID = cookieData?.id;
        savedProductID = savedProductID != null ? parseInt(savedProductID) : savedProductID;

        if (this.isNumeric(savedProductID)) {
            this.cartItems.forEach((item) => {
                item.quantity = cookieData.q;
                if (item.id === savedProductID) {
                    window.sendCooeeAddToCart(item);
                    this.cookieHelper.deleteCookie(this.COOKIE_NAME);
                }
            });
        }
    }

    /**
     * Overwrite {@link XMLHttpRequest#send} so that we can listen for all the requests from Shopify store and check if
     * it is adding or updating or removing items from the cart. If it is, we send 'Add To Cart' and 'Remove From
     * Cart' events.
     */
    private overwriteXMLHttpRequest(): void {
        const _this = this;
        let originalSend = window.XMLHttpRequest.prototype.send;

        window.XMLHttpRequest.prototype.send = function (sendData) {
            this.addEventListener('load', function () {
                try {
                    // @ts-ignore
                    _this.performEvent(this._url, sendData);
                } catch (e) {
                    Log.error('Unable to process cart change', e);
                }
            });

            // @ts-ignore
            return originalSend.apply(this, arguments);
        };
    }

    /**
     * Overwrite {@link fetch} so that we can listen for all the requests from Shopify store and check if
     * it is adding or updating or removing items from the cart. If it is, we send 'Add To Cart' and 'Remove From
     * Cart' events.
     */
    private overwriteFetchMethod(): void {
        const _this = this;
        let originalFetch = window.fetch;

        window.fetch = function (fetchUrl, options) {
            return originalFetch
                // @ts-ignore
                .apply(window, arguments)
                .then((response) => {
                    try {
                        _this.performEvent(fetchUrl.toString(), options?.body);
                    } catch (e) {
                        Log.error('Unable to process cart change', e);
                    }
                    return response;
                });
        };
    }

    private addSubmitListener(): void {
        document.addEventListener('submit', (event) => {
            const action = (event.target as HTMLFormElement).action;
            const path = new URL(action).pathname;
            if (path === '/cart/add') {
                const data = this.parseFormToObject(event.target);
                const cookieData = {
                    id: data.id,
                    q: data.quantity,
                };
                this.cookieHelper.setCookie(this.COOKIE_NAME, JSON.stringify(cookieData), 2, 'minute');
            }
        });
    }

    private parseFormToObject(form: unknown) {
        if (!form) {
            return {};
        }

        if (form instanceof HTMLFormElement) {
            const formData: FormData = new FormData(form);

            let formDataObject: Record<string, any> = {};
            formData.forEach(function (value, key) {
                if (key !== 'utf8') formDataObject[key] = value;
            });

            return formDataObject;
        } else if (typeof form === 'string') {
            let formJSON;
            try {
                formJSON = JSON.parse(form);
            } catch (e) {
                Log.error('Could not parse JSON string', form);
                return {};
            }

            return formJSON;
        } else {
            Log.warn('Unidentified type of form data', typeof form);
        }

        return {};
    }

    private isNumeric(number: any) {
        return !isNaN(parseFloat(number?.toString())) && isFinite(number?.toString());
    }

    private performEvent(url: string, formData: unknown): void {
        if (!formData) {
            return;
        }

        const cartRoutes = window.CooeeSDK.routes.cart;

        if (url === '/cart/add.js' || (cartRoutes && url === cartRoutes.add)) {
            this.onCartAdd(formData);
        } else if (url === '/cart/change.js' || (cartRoutes && url === cartRoutes.change) ||
            url === '/cart/update.js' || (cartRoutes && url === cartRoutes.update)) {
            this.onChangeCart();
        }
    }

    private onCartAdd(formData: unknown): void {
        let itemJSON = this.parseFormToObject(formData);

        const itemID = itemJSON.items?.[0]?.id || itemJSON.id;
        if (itemID) {
            let savedProductID = this.cookieHelper.getCookie(this.COOKIE_NAME)?.id;
            savedProductID = savedProductID != null ? parseInt(savedProductID) : savedProductID;

            if (this.isNumeric(savedProductID) && parseInt(itemID) === savedProductID) {
                this.cookieHelper.deleteCookie(this.COOKIE_NAME);
            }

            this.onChangeCart();
        }
    }

    /**
     * This method make a http call to update current cart items.
     *
     * @param callback
     */
    private fetchCartItems(callback = new Function()): Promise<Record<string, any>[]> {
        return fetch('/cart.js')
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((response) => {
                if (response !== undefined) {
                    this.cartItems = response.items;
                }

                callback();
                return this.cartItems;
            });
    }

    /**
     * This method loop through every cart item and identifies whether item is added/updated in the cart.
     *
     * @param newCartItems
     */
    private onCartHandler(newCartItems: Record<string, any>[]): void {
        let cartItemList: Record<string, any> = {};
        this.cartItems.forEach(function (cartItem) {
            cartItemList[cartItem.key] = cartItem;
        });

        newCartItems.forEach((item: Record<string, any>) => {
            if (cartItemList[item.key]) {
                let cartItem = cartItemList[item.key];

                if (parseInt(cartItem.quantity) !== parseInt(item.quantity)) {
                    if (cartItem.quantity < item.quantity) {
                        window.sendCooeeAddToCart(this.fetchCartItemDifference(cartItem, item));
                    } else {
                        window.sendCooeeRemoveFromCart(this.fetchCartItemDifference(cartItem, item));
                    }
                }
                delete cartItemList[item.key];
            } else {
                window.sendCooeeAddToCart(item);
            }
        });

        if (Object.keys(cartItemList).length !== 0 && cartItemList.constructor === Object) {
            for (const key in cartItemList) {
                if (cartItemList.hasOwnProperty(key)) {
                    let item = cartItemList[key];
                    window.sendCooeeRemoveFromCart(item);
                    delete cartItemList[key];
                }
            }
        }

        // noinspection JSIgnoredPromiseFromCall
        this.fetchCartItems();
    }

    /**
     * This method identifies what to do when cart item change.
     */
    private onChangeCart(): void {
        if (this.cartItems !== undefined && this.cartItems.length !== 0) {
            let oldCartItems = this.cartItems;
            this.fetchCartItems(() => {
                let newCartItems = this.cartItems;
                this.cartItems = oldCartItems;
                this.onCartHandler(newCartItems);
            });
        } else {
            this.fetchCartItems(() => {
                this.cartItems.forEach((cartItem: Record<string, any>) => {
                    window.sendCooeeAddToCart(cartItem);
                });
            });
        }
    }

    /**
     * This method fetches the quantity added/removed from cart items.
     * @param oldItem
     * @param newItem
     * @return {*}
     */
    private fetchCartItemDifference(oldItem: Record<string, any>, newItem: Record<string, any>): Record<string, any> {
        let itemQty = newItem.quantity;
        const oldItemQuantity = parseInt(oldItem.quantity);
        const newItemQuantity = parseInt(newItem.quantity);

        if (oldItemQuantity < newItemQuantity) {
            itemQty = newItemQuantity - oldItemQuantity;
        } else if (oldItemQuantity > newItem.quantity) {
            itemQty = oldItemQuantity - newItemQuantity;
        }

        newItem.quantity = itemQty;
        return newItem;
    }

}
