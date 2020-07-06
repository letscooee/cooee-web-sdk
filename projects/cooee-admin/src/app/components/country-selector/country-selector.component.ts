import {Component, forwardRef, Input, OnInit} from '@angular/core';
import * as countryDataList from 'world-countries';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';

/**
 * Component class to select country code.
 */
@Component({
    selector: 'app-country-selector',
    templateUrl: './country-selector.component.html',
    styleUrls: ['./country-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CountrySelectorComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CountrySelectorComponent),
            multi: true,
        }
    ]
})
export class CountrySelectorComponent implements ControlValueAccessor, Validator, OnInit {

    @Input() disabled: boolean;

    countryList: Array<any> = [];
    countryCode: any;

    private onChangeCallback: (_: string) => void;

    constructor() {
    }

    ngOnInit() {
        this.getCountryList();
    }

    getCountryList() {
        // @ts-ignore
        countryDataList.forEach((country) => {
            this.countryList.push({
                name: country.name.common,
                cca2: country.cca2,
                flag: country.flag
            });
        });

        this.countryList = this.countryList.sort((a, b) => a.name.localeCompare(b.name));
    }

    selectedCountry() {
        if (this.onChangeCallback) {
            this.onChangeCallback(this.countryCode);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
    }

    writeValue(value: any): void {
        this.countryCode = value;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this.countryCode) {
            return null;
        }

        return {
            countryData: {
                valid: false
            }
        };
    }
}
