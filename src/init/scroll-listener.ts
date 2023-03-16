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

    private static INSTANCE: ScrollListener;

    private static readonly DEBOUNCE_TIME = 1000; // ms
    private static readonly THRESHOLD = 10;

    private readonly apiService = SafeHttpService.getInstance();

    private _lastScreenOrScroll: Date = new Date();
    private lastPercent = 0;

    /**
     * Private constructor to make this class singleton.
     * @private
     */
    private constructor() {
        // This class is singleton
    }

    set lastScreenOrScroll(value: Date) {
        this._lastScreenOrScroll = value;
    }

    /**
     * Get instance of the class.
     *
     * @return {ScrollListener}
     */
    public static getInstance(): ScrollListener {
        if (!this.INSTANCE) {
            this.INSTANCE = new ScrollListener();
        }

        return this.INSTANCE;
    }

    listen(): void {
        fromEvent(window, 'scroll')
            .pipe(
                debounceTime(ScrollListener.DEBOUNCE_TIME),
                map(() => {
                    const percent = this.getPercentScrolledY(window.scrollY);
                    if (Math.abs(this.lastPercent - percent) >= ScrollListener.THRESHOLD || percent === 100) {
                        return percent;
                    }
                }),
            )
            .subscribe((percent) => {
                this.sendScroll(percent);
            });
    }

    private sendScroll(percent: number | undefined): void {
        if (percent == null) {
            return;
        }

        const params = {
            percent,
            timeMS: new Date().getTime() - this._lastScreenOrScroll.getTime(),
        };

        this.lastPercent = percent;

        const scrollEventID = SessionStorageHelper.getString(Constants.SESSION_STORAGE_SCROLL_ID, '');
        const event = new Event(Constants.EVENT_SCROLL, params, null, scrollEventID);
        this.apiService.sendEvent(event);
        SessionStorageHelper.setString(Constants.SESSION_STORAGE_SCROLL_ID, event.id.toHexString());
        this._lastScreenOrScroll = new Date(event.occurred);
    }

    private getPercentScrolledY(currentScrollY: number): number {
        const scrollHeight = window.document.body.scrollHeight;
        const innerHeight = window.innerHeight;

        return Math.ceil((currentScrollY + innerHeight) / scrollHeight * 100);
    }

}
