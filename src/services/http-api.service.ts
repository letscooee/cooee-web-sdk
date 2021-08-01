import {Event} from "../models/event";
import {Constants} from "../constants";

export class HttpAPIService {

    async registerDevice() {
        // TODO implement me
    }

    async sendEvent(event: Event) {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(event),
            headers: this.getDefaultHeaders()
        };

        const response = await fetch(Constants.API_URL + "/v1/event/track", requestOptions)

        return response.json()
    }

    private getDefaultHeaders(): Headers {
        const headers = new Headers();

        // TODO pull it dynamically from the release version
        headers.set('sdk-version', '1.0.0');
        headers.set('sdk-version-code', '1');

        return headers;
    }
}