import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CountrySelectorComponent} from './country-selector.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
    imports: [
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        CommonModule
    ],
    declarations: [
        CountrySelectorComponent
    ],
    exports: [
        CountrySelectorComponent
    ]
})
export class CountrySelectorModule {
}
