import {NgModule} from '@angular/core';
import {EnumFormatterPipe} from './enum-formatter.pipe';
import {MinuteSecondsPipe} from './minute-seconds.pipe';

@NgModule({
    declarations: [
        EnumFormatterPipe,
        MinuteSecondsPipe
    ],
    exports: [
        EnumFormatterPipe,
        MinuteSecondsPipe
    ]
})

export class AppPipesModule {
}
