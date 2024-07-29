import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiOneTimeCodeFormFieldComponent } from './one-time-code-form-field/one-time-code-form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SxmUiModule } from '@de-care/sxm-ui';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SxmUiModule],
    declarations: [SxmUiOneTimeCodeFormFieldComponent],
    exports: [SxmUiOneTimeCodeFormFieldComponent]
})
export class SharedSxmUiUiOneTimeCodeFormFieldModule {}
