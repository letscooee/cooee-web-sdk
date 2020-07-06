import {NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule} from '@fuse/components';

import {fuseConfig} from './fuse-config';

import {AppComponent} from './app.component';
import {LayoutModule} from './layout/layout.module';
import {AppRoutingModule} from './app.routing';
import {NgxPermissionsModule} from 'ngx-permissions';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {loadFontAwesomeExplicitFonts} from './font-awesome-fonts';
import {MAT_EXPANSION_PANEL_DEFAULT_OPTIONS} from '@angular/material/expansion';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,

        // App modules
        NgxPermissionsModule.forRoot(),
        NgxSpinnerModule,
        LayoutModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        {
            provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,
            useValue: {
                hideToggle: true,
                expandedHeight: '*',
                collapsedHeight: '*'
            }
        },
        Title
    ]
})
export class AppModule {

    constructor(library: FaIconLibrary) {
        loadFontAwesomeExplicitFonts(library);
    }
}
