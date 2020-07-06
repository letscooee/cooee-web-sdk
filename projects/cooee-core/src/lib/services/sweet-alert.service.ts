import {Injectable} from '@angular/core';
import Swal, {SweetAlertOptions, SweetAlertResult} from 'sweetalert2';

/**
 * Service for displaying some app level dialogs & toasts.
 *
 * @author Shashank Agrawal
 */
@Injectable({
    providedIn: 'root'
})
export class SweetAlertService {

    constructor() {
    }

    alert(config: SweetAlertOptions): Promise<SweetAlertResult> {
        return Swal.fire(config);
    }

    error(title: string, text?: string, config?: SweetAlertOptions): Promise<SweetAlertResult> {
        config = config || {};
        config.icon = 'error';
        config.title = title;
        config.text = text;

        return Swal.fire(config);
    }

    success(title: string, text?: string, config?: SweetAlertOptions): Promise<SweetAlertResult> {
        config = config || {};
        config.icon = 'success';
        config.title = title;
        config.text = text;

        return Swal.fire(config);
    }

    async confirm(title: string, text?: string, confirmButtonText?: string, config?: SweetAlertOptions): Promise<boolean> {
        config = config || {};
        config.title = title;
        config.text = text;
        config.icon = 'warning';
        config.showCancelButton = true;
        config.confirmButtonColor = '#3085d6';
        config.cancelButtonColor = '#d33';
        config.confirmButtonText = confirmButtonText ?? 'Yes';

        const result = await Swal.fire(config);
        return !!result.value;
    }

    toast(title: string, config?: SweetAlertOptions): Promise<SweetAlertResult> {
        config = config || {};
        config.toast = true;
        config.title = title;
        config.position = config.position || 'bottom-end';
        config.timer = config.timer || 2000;

        return Swal.fire(config);
    }
}

