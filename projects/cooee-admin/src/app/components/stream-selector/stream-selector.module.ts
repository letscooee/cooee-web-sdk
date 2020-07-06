import {NgModule} from '@angular/core';
import {StreamSelectorComponent} from './stream-selector.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FuseSharedModule} from '@fuse/shared.module';

@NgModule({
    declarations: [
        StreamSelectorComponent
    ],
    exports: [
        StreamSelectorComponent
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
export class StreamSelectorModule {

}
