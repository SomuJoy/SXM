import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioOptionAsBlockFormFieldComponent } from './radio-option-as-block-form-field/radio-option-as-block-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [RadioOptionAsBlockFormFieldComponent],
    exports: [RadioOptionAsBlockFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionAsBlockFormFieldModule {}
