import {Event} from '../models/event/event';
import {SafeHttpService} from '../services/safe-http-service';
import {Constants} from '../constants';
import {SessionStorageHelper} from '../utils/session-storage-helper';
import {debounceTime, fromEvent, map} from 'rxjs';

/**
 * Add the common listeners globally.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class ScrollListener {

    static readonly DEBOUNCE_TIME = 1000; // ms
    static readonly THRESHOLD = 10;
    static LAST_SCREEN_OR_SCROLL: Date = new Date();
    static LAST_PERCENT = 0;

    private readonly apiService = SafeHttpService.getInstance();

    listen(): void {
        fromEvent(window, 'scroll')
            .pipe(
                debounceTime(ScrollListener.DEBOUNCE_TIME),
                map(() => {
                    const percent = this.getPercentScrolled(window.scrollY);
                    if (Math.abs(ScrollListener.LAST_PERCENT - percent) >= ScrollListener.THRESHOLD) {
                        return percent;
                    }
                }),
            ).subscribe((percent) => {
            this.sendScroll(percent);
        });
    }

    private sendScroll(percent: number | undefined): void {
        if (percent == null) {
            return;
        }

        const params = {
            per: percent,
            timeMS: new Date().getTime() - ScrollListener.LAST_SCREEN_OR_SCROLL.getTime(),
        };

        ScrollListener.LAST_PERCENT = percent;

        const scrollEventID = SessionStorageHelper.getString(Constants.SESSION_STORAGE_SCROLL_ID, '');
        const event = new Event(Constants.EVENT_SCROLL, params, null, scrollEventID);
        this.apiService.sendEvent(event);
        SessionStorageHelper.setString(Constants.SESSION_STORAGE_SCROLL_ID, event.id.toHexString());
        ScrollListener.LAST_SCREEN_OR_SCROLL = new Date(event.occurred);
    }

    private getPercentScrolled(position: number): number {
        const scrollHeight = window.document.body.scrollHeight;
        const innerHeight = window.innerHeight;

        return Math.ceil((position + innerHeight) / scrollHeight * 100);
    }

}
