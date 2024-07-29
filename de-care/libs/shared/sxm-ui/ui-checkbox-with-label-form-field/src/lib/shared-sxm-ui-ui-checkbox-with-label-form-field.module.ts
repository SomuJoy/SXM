import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxWithLabelFormFieldComponent } from './checkbox-with-label-form-field/checkbox-with-label-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [CheckboxWithLabelFormFieldComponent],
    exports: [CheckboxWithLabelFormFieldComponent]
})
export class SharedSxmUiUiCheckboxWithLabelFormFieldModule {}
