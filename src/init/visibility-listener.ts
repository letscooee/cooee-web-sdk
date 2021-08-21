import {Constants} from "../constants";
import {SessionManager} from "../session/session-manager";
import {NewSessionExecutor} from "../session/new-session-executor";
import {Event} from "../models/event/event";
import {DevicePropertiesCollector} from "../device/properties-collector";
import {SafeHttpCallService} from "../services/safe-http-call-service";
import {RuntimeData} from "../utils/runtime-data";

export class VisibilityListener {

    private readonly apiService = new SafeHttpCallService();
    private readonly runtimeData = RuntimeData.getInstance();

    listen(): void {
        document.onvisibilitychange = () => {
            if (document.visibilityState === 'visible') {
                // noinspection JSIgnoredPromiseFromCall
                this.onVisible();
            } else {
                // noinspection JSIgnoredPromiseFromCall
                this.onHidden();
            }
        };
    }

    private async onVisible(): Promise<void> {
        this.runtimeData.setActive();
        const duration = this.runtimeData.getTimeForInactiveInSeconds();

        if (duration > Constants.IDLE_TIME_IN_SECONDS) {
            SessionManager.getInstance().conclude();

            new NewSessionExecutor().execute();
        }

        const event = new Event('CE Web Active', {'Inactive Duration': duration});
        event.deviceProps = await new DevicePropertiesCollector().get();
        this.apiService.sendEvent(event);
    }

    private async onHidden(): Promise<void> {
        this.runtimeData.setInactive();
        const duration = this.runtimeData.getTimeForActiveInSeconds();
        this.apiService.sendEvent(new Event('CE Web Inactive', {'Active Duration': duration}));
    }
}