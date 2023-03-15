import {Event} from '../models/event/event';
import {SafeHttpService} from '../services/safe-http-service';
import {Constants} from '../constants';
import {SessionStorageHelper} from '../utils/session-storage-helper';

/**
 * Add the common listeners globally.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class CommonListeners {

    static LAST_SCREEN_OR_SCROLL: Date = new Date();

    private readonly apiService = SafeHttpService.getInstance();

    /**
     * Start listing to common events.
     */
    listen(): void {
        window.onpageshow = () => {
            const event = new Event(Constants.EVENT_SCREEN_VIEW, {'screenName': location.pathname});
            this.apiService.sendEvent(event);
            SessionStorageHelper.remove(Constants.SESSION_STORAGE_SCROLL_ID);
            CommonListeners.LAST_SCREEN_OR_SCROLL = new Date(event.occurred);
        };
    }

    scroll(): void {
        let lastKnownScrollPosition = 0;
        let ticking = false;
        document.addEventListener('scroll', () => {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.doSomething(lastKnownScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    doSomething(scrollPos: number): void {
        console.log(scrollPos);
        const params = {
            per: this.getPercentScrolled(scrollPos),
            time: new Date().getTime() - CommonListeners.LAST_SCREEN_OR_SCROLL.getTime(),
        };

        const scrollEventID = SessionStorageHelper.getString(Constants.SESSION_STORAGE_SCROLL_ID, '');
        const event = new Event(Constants.EVENT_SCROLL, params, null, scrollEventID);
        this.apiService.sendEvent(event);
        SessionStorageHelper.setString(Constants.SESSION_STORAGE_SCROLL_ID, event.id.toHexString());
        CommonListeners.LAST_SCREEN_OR_SCROLL = new Date(event.occurred);
    }

    getPercentScrolled(position: number): number {
        const scrollHeight = window.document.body.scrollHeight;
        const innerHeight = window.innerHeight;

        return Math.ceil((position + innerHeight) / scrollHeight * 100);
    }

    throttle(fn: Function, wait: number): any {
        let time = Date.now();
        return () => {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        };
    }

    debounce(method: any, delay = 2000): void {
        clearTimeout(method._tId);
        method._tId = setTimeout(() => {
            method();
        }, delay);
    }

    debounce2(func: any, timeout = 300): any {
        console.log('Test');
        let timer: any;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    /*
    debounce(fn: Function, ms = 300): Function {
        let timeoutId: ReturnType<typeof setTimeout>;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId);
            // eslint-disable-next-line no-invalid-this
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };
    */

}
