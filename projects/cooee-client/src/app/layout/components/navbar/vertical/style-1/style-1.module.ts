import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {FuseNavigationModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';

import {NavbarVerticalStyle1Component} from './style-1.component';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        NavbarVerticalStyle1Component
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports: [
        NavbarVerticalStyle1Component
    ]
})
export class NavbarVerticalStyle1Module {
}
