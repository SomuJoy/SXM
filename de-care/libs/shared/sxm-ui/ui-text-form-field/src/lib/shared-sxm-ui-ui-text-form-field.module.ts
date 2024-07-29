import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiTextFormFieldComponent } from './text-form-field/text-form-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedSxmUiUiInputFocusModule, SharedSxmUiUiTrimFormFieldModule],
    declarations: [SxmUiTextFormFieldComponent],
    exports: [SxmUiTextFormFieldComponent]
})
export class SharedSxmUiUiTextFormFieldModule {}
