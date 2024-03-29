import {Constants} from '../constants';
import {Event} from '../models/event/event';
import {SafeHttpService} from '../services/safe-http-service';
import {Props} from '../types';
import {RuntimeData} from '../utils/runtime-data';

/**
 * Listen for the visibility of the document. It is useful to know if the document is in the background or an
 * invisible tab. This helps the SDK to send respective events.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState
 */
export class VisibilityListener {

    private static readonly ACTIVE_DURATION = 'aDur';
    private static readonly INACTIVE_DURATION = 'iaDur';

    private readonly apiService = SafeHttpService.getInstance();
    private readonly runtimeData = RuntimeData.getInstance();

    /**
     * Start listening the event.
     */
    listen(): void {
        document.onvisibilitychange = () => {
            if (document.visibilityState === 'visible') {
                // noinspection JSIgnoredPromiseFromCall
                this.onVisible();
            } else if (document.visibilityState === 'hidden') {
                // noinspection JSIgnoredPromiseFromCall
                this.onHidden();
            }
        };
    }

    /**
     * Do work when the page content may be at least partially visible. This means that the page is the
     * foreground tab of a non-minimized window.
     * @private
     */
    private async onVisible(): Promise<void> {
        this.runtimeData.setActive();
        /*
        const duration = this.runtimeData.getTimeForInactiveInSeconds();

        if (duration > Constants.IDLE_TIME_IN_SECONDS) {
            SessionManager.getInstance().conclude();

            new NewSessionExecutor().execute();
        }

        const props: Props = {};
        props[VisibilityListener.INACTIVE_DURATION] = duration;

        this.apiService.sendEvent(new Event(Constants.EVENT_APP_FOREGROUND, props));
        */
    }

    /**
     * Send event when the page content is not visible to the user. This means that the document is
     * either a background tab or part of a minimized window, or the OS screen lock is active.
     * @private
     */
    private async onHidden(): Promise<void> {
        this.runtimeData.setInactive();
        const duration = this.runtimeData.getTimeForActiveInSeconds();

        const props: Props = {};
        props[VisibilityListener.ACTIVE_DURATION] = duration;

        this.apiService.sendEvent(new Event(Constants.EVENT_APP_BACKGROUND, props));
    }

}
