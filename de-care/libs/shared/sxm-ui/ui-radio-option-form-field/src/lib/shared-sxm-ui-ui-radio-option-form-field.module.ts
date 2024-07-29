import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioOptionFormFieldComponent } from './radio-option-form-field/radio-option-form-field.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [RadioOptionFormFieldComponent],
    exports: [RadioOptionFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionFormFieldModule {}
