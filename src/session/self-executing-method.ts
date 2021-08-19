import {Event} from '../models/event/event';
import {DevicePropertiesCollector} from '../device/properties-collector';
import {SafeHttpCallService} from '../services/safe-http-call-service';
import {RuntimeData} from '../utils/runtime-data';

(
    function() {
        const apiService: SafeHttpCallService = new SafeHttpCallService();
        const runtimeData = RuntimeData.getInstance();

        document.onvisibilitychange = async () => {
            if (document.visibilityState === 'visible') {
                runtimeData.setActive();
                const duration = runtimeData.getTimeForInactiveInSeconds();

                const event = new Event('CE Web Active', {'InActive Duration': duration});
                event.deviceProps = await new DevicePropertiesCollector().get();
                apiService.sendEvent(event);
            } else {
                runtimeData.setInactive();
                const duration = runtimeData.getTimeForActiveInSeconds();
                apiService.sendEvent(new Event('CE Web Inactive', {'Active Duration': duration}));
            }
        };

        window.onpageshow = () => {
            apiService.sendEvent(new Event('CE Screen View', {'screenName': location.pathname}));
        };
    }
)();
