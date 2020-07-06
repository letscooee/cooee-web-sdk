import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {SweetAlertService} from './sweet-alert.service';

/**
 * Service to resolve error response.
 *
 * @author Shashank Agrawal
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

    constructor(private sweetAlertService: SweetAlertService) {
    }

    handleHTTPError(response: HttpErrorResponse): void {
        console.log(response);
        if (response.status === 0) {
            const text = 'That thing is still around? We think you are not connected!';
            this.sweetAlertService.alert({title: 'The Internet?', text: text, icon: 'question'});
            return;
        }

        if (response.status === 401) {
            return;
        }

        if (response.status === 500) {
            this.sweetAlertService.error('Oops!', 'Something went wrong! We have been notified. Please try again later.');
            return;
        }

        if (response.error && response.error.message) {
            this.sweetAlertService.alert({
                text: response.error.message,
                icon: 'error',
                animation: false
            });
        }
    }
}
