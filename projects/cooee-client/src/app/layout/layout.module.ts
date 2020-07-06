import {NgModule} from '@angular/core';

import {VerticalLayout1Module} from './vertical-layout/vertical-layout.module';
import {EmptyLayoutModule} from './empty-layout/empty-layout.module';

@NgModule({
    imports: [
        EmptyLayoutModule,
        VerticalLayout1Module
    ],
    exports: [
        EmptyLayoutModule,
        VerticalLayout1Module
    ]
})
export class LayoutModule {
}
