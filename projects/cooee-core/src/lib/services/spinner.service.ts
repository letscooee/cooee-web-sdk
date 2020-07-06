import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {Spinner} from 'ngx-spinner/lib/ngx-spinner.enum';

/**
 * Service for displaying spinner for promises;
 *
 * @author Shashank Agrawal
 */
@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    private defaultSpinner: Spinner = {
        size: 'medium',
        fullScreen: false,
        type: 'ball-clip-rotate-pulse',
        color: 'rgb(0, 112, 224)',
        bdColor: 'rgba(255, 255, 255, 0.8)'
    };

    constructor(private spinner: NgxSpinnerService) {
    }

    /**
     * Show spinner while the given promise is being resolved/rejected. By default this method uses the global "ngx-spinner" added in
     * "default-layout.component.html"
     *
     * @param promise
     * @param name Name of the custom spinner to show
     * @param config ngx-spinner config object
     */
    showFor(promise: Promise<any>, name?: string, config?: Spinner): void {
        config = {...this.defaultSpinner, ...config};
        this.spinner.show(name, config);

        promise.then(() => {
            this.spinner.hide(name);
        }, () => {
            this.spinner.hide(name);
        });
    }
}
