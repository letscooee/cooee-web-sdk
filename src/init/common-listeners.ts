import {Event} from "../models/event/event";
import {SafeHttpCallService} from "../services/safe-http-call-service";

export class CommonListeners {

    private readonly apiService = new SafeHttpCallService();

    listen(): void {
        window.onpageshow = () => {
            this.apiService.sendEvent(new Event('CE Screen View', {'screenName': location.pathname}));
        };
    }
}