import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {FuseSidebarModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';

import {ContentModule} from '../components/content/content.module';
import {NavbarModule} from '../components/navbar/navbar.module';
import {ToolbarModule} from '../components/toolbar/toolbar.module';

import {VerticalLayoutComponent} from './vertical-layout.component';

@NgModule({
    declarations: [
        VerticalLayoutComponent
    ],
    imports: [
        RouterModule,

        FuseSharedModule,
        FuseSidebarModule,

        ContentModule,
        NavbarModule,
        ToolbarModule
    ],
    exports: [
        VerticalLayoutComponent
    ]
})
export class VerticalLayout1Module {
}
