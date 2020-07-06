import {Component, forwardRef, Input} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {Competency} from '../../models/organization/competency.enum';
import {CompetencyMapping} from '../../models/organization/competency-mapping';

@Component({
    selector: 'app-competency-selector',
    templateUrl: './competency-selector.component.html',
    styleUrls: ['./competency-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CompetencySelectorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CompetencySelectorComponent),
            multi: true
        }
    ]
})
export class CompetencySelectorComponent implements ControlValueAccessor, Validator {

    private onChangeCallback: (_: string) => void;
    readonly competencyMappings = CompetencyMapping.getValues();

    _selectedCompetency: Competency;

    @Input() required = false;
    @Input() label = 'Choose Competency';

    onSelected(): void {
        this.onChangeCallback(this._selectedCompetency);
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
    }

    writeValue(value: any): void {
        this._selectedCompetency = value;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.required && this._selectedCompetency) {
            return null;
        }

        return {
            category: {
                valid: false
            }
        };
    }
}
