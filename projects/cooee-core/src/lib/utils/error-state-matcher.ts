import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgControl, NgForm} from '@angular/forms';

/**
 * Unlike the ShowOnDirtyErrorStateMatcher defined in
 * https://github.com/angular/components/blob/9.0.0/src/material/core/error/error-options.ts#L14, this ErrorStateMatcher is used in a
 * custom component which is basically a wrapper for a Material input component.
 *
 * Since Angular doesn't give the callback to components for touched/dirty/pristine state change, this custom matcher will also show
 * error when the parent/implementing/wrapper component's control is touched.
 *
 * https://stackoverflow.com/a/46748943/2405040
 * https://github.com/angular/angular/issues/17736
 * https://netbasal.com/adding-integrated-validation-to-custom-form-controls-in-angular-dc55e49639ae
 * https://stackoverflow.com/questions/44731894/get-access-to-formcontrol-from-the-custom-form-component-in-angular
 * https://stackoverflow.com/questions/44730711/how-do-i-know-when-custom-form-control-is-marked-as-pristine-in-angular
 *
 * @author Shashank Agrawal
 */
export class ParentControlTouchedStateMatcher implements ErrorStateMatcher {

    constructor(private parentControl: NgControl) {
    }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid && (control.touched || this.parentControl.touched || (form && form.submitted)));
    }
}
