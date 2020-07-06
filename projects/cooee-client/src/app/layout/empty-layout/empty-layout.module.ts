import {NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

import {FuseSidebarModule} from '@fuse/components';
import {FuseSharedModule} from '@fuse/shared.module';

import {ContentModule} from '../components/content/content.module';
import {NavbarModule} from '../components/navbar/navbar.module';
import {ToolbarModule} from '../components/toolbar/toolbar.module';
import {EmptyLayoutComponent} from './empty-layout.component';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports: [
        MatSidenavModule,

        FuseSharedModule,
        FuseSidebarModule,

        ContentModule,
        NavbarModule,
        ToolbarModule
    ],
    exports: [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule {
}
