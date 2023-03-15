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
export class ScrollListener {

    static LAST_SCREEN_OR_SCROLL: Date = new Date();

    private readonly apiService = SafeHttpService.getInstance();

    listen(): void {
        let lastKnownScrollPosition = 0;
        let ticking = false;
        document.addEventListener('scroll', () => {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(this.debounce(() => {
                    this.sendScroll(lastKnownScrollPosition);
                    ticking = false;
                }, 4000));

                ticking = true;
            }
        });
    }

    sendScroll(scrollPos: number): void {
        const params = {
            per: this.getPercentScrolled(scrollPos),
            time: new Date().getTime() - ScrollListener.LAST_SCREEN_OR_SCROLL.getTime(),
        };

        const scrollEventID = SessionStorageHelper.getString(Constants.SESSION_STORAGE_SCROLL_ID, '');
        const event = new Event(Constants.EVENT_SCROLL, params, null, scrollEventID);
        this.apiService.sendEvent(event);
        SessionStorageHelper.setString(Constants.SESSION_STORAGE_SCROLL_ID, event.id.toHexString());
        ScrollListener.LAST_SCREEN_OR_SCROLL = new Date(event.occurred);
    }

    debounce(func: Function, timeout = 300): any {
        let timer: any;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    private getPercentScrolled(position: number): number {
        const scrollHeight = window.document.body.scrollHeight;
        const innerHeight = window.innerHeight;

        return Math.ceil((position + innerHeight) / scrollHeight * 100);
    }

}
