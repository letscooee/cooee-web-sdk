import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {IndustrySelectorComponent} from './industry-selector.component';

@NgModule({
    declarations: [
        IndustrySelectorComponent
    ],
    exports: [
        IndustrySelectorComponent
    ],
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRippleModule,
        MatSelectModule,
        FuseSharedModule
    ]
})

export class IndustrySelectorModule {
}
