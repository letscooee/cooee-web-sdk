import {Component, Input, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl} from '@angular/forms';
import {STREAMS} from './STREAMS';
import {ParentControlTouchedStateMatcher} from 'cooee-core/lib/utils/error-state-matcher';

@Component({
    selector: 'app-stream-selector',
    templateUrl: './stream-selector.component.html',
    styleUrls: ['./stream-selector.component.scss']
})
export class StreamSelectorComponent implements ControlValueAccessor {

    private onChangeCallback: (_: string) => void;
    private lastValue: any;

    readonly streams = STREAMS.sort((a, b) => a.label.localeCompare(b.label));
    readonly control = new FormControl();

    readonly matcher = new ParentControlTouchedStateMatcher(this.ngControl);

    @Input() required = false;
    @Input() label = 'Choose Stream';

    constructor(@Optional() @Self() public ngControl: NgControl) {
        this.ngControl.valueAccessor = this;
    }

    onSelected(): void {
        // For some reason, mat-select fires this even two times upon un-selecting a value https://github.com/angular/components/issues/7851
        if (this.lastValue !== this.control.value) {
            this.lastValue = this.control.value;
            this.onChangeCallback(this.control.value);
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
    }

    writeValue(value: any): void {
        this.control.setValue(value);
    }
}
