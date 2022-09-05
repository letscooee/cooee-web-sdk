import {Event} from '../models/event/event';
import {SafeHttpService} from '../services/safe-http-service';

/**
 * Add the common listeners globally.
 *
 * @author Shashank Agrawal
 * @since 0.0.1
 */
export class CommonListeners {

    private readonly apiService = SafeHttpService.getInstance();

    /**
     * Start listing to common events.
     */
    listen(): void {
        window.onpageshow = () => {
            this.apiService.sendEvent(new Event('CE Screen View', {'screenName': location.pathname}));
        };
    }

}
