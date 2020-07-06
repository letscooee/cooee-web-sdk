import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {FlexLayoutModule} from '@angular/flex-layout';

import {FuseDirectivesModule} from '@fuse/directives/directives';
import {FusePipesModule} from '@fuse/pipes/pipes.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule,

        NgxPermissionsModule.forChild(),
        NgxSpinnerModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        FlexLayoutModule,

        FuseDirectivesModule,
        FusePipesModule,

        NgxSpinnerModule
    ]
})
export class FuseSharedModule {
}
