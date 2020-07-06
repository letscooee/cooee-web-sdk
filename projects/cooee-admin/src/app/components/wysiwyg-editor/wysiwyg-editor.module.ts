import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WysiwygEditorComponent} from './wysiwyg-editor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    WysiwygEditorComponent
  ],
  exports: [
    WysiwygEditorComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CKEditorModule
  ]
})
export class WysiwygEditorModule {
}
