import {Component, forwardRef, Input, OnInit} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';

@Component({
    selector: 'app-wysiwyg-editor',
    templateUrl: './wysiwyg-editor.component.html',
    styleUrls: ['./wysiwyg-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => WysiwygEditorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => WysiwygEditorComponent),
            multi: true
        }
    ]
})
export class WysiwygEditorComponent implements OnInit, ControlValueAccessor, Validator {

    private onChangeCallback: (_: string) => void;

    readonly editorType = ClassicEditor;
    readonly editorConfig = {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
            '|', 'outdent', 'indent', '|', 'undo', 'redo']
    };

    @Input() required = true;

    _body: string;

    constructor() {
    }

    ngOnInit() {
    }

    onBodyUpdated(): void {
        this.onChangeCallback(this._body);
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
    }

    writeValue(value: any): void {
        this._body = value;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        if (this._body) {
            return null;
        }

        return {
            category: {
                valid: false
            }
        };
    }
}
