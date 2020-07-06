import {Component, forwardRef, Input, SkipSelf} from '@angular/core';
import {
    AbstractControl,
    ControlContainer,
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from '@angular/forms';
import {Industry} from '../../models/organization/industry.enum';

@Component({
    selector: 'app-industry-selector',
    templateUrl: './industry-selector.component.html',
    styleUrls: ['./industry-selector.component.scss'],
    /*
     * TODO "touched" event is not propagated from parent.
     * https://stackoverflow.com/a/46748943/2405040
     * https://github.com/angular/angular/issues/17736
     * https://netbasal.com/adding-integrated-validation-to-custom-form-controls-in-angular-dc55e49639ae
     * https://stackoverflow.com/questions/44731894/get-access-to-formcontrol-from-the-custom-form-component-in-angular
     * https://stackoverflow.com/questions/44730711/how-do-i-know-when-custom-form-control-is-marked-as-pristine-in-angular
     */
    viewProviders: [
        {
            provide: ControlContainer,
            useFactory: (container: ControlContainer) => container,
            deps: [[new SkipSelf(), ControlContainer]]
        }
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IndustrySelectorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => IndustrySelectorComponent),
            multi: true
        }
    ]
})
export class IndustrySelectorComponent implements ControlValueAccessor, Validator {

    private onChangeCallback: (_: string) => void;
    private lastValue: any;

    readonly allIndustries;

    control = new FormControl();

    @Input() required = false;
    @Input() label = 'Choose Industry';

    constructor() {
        this.allIndustries = Object.keys(Industry).map(item => {
            const title = item.toLowerCase().split('_').join(' ').replace(/(^|\s)\S/g, (text) => {
                return text.toUpperCase();
            });

            return {title: title, value: item};
        });
    }

    onSelected(): void {
        // For some reason, mat-select fires this even two times upon un-selecting a value https://github.com/angular/components/issues/7851
        if (this.lastValue !== this.control.value) {
            this.lastValue = this.control.value;
            this.onChangeCallback(this.control.value);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
    }

    writeValue(value: any): void {
        this.control.setValue(value);
    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.control.errors;
    }
}
