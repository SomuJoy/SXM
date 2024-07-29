import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { RadioOptionCardFormFieldComponent } from './radio-option-card-form-field/radio-option-card-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiContentCardModule],
    declarations: [RadioOptionCardFormFieldComponent],
    exports: [RadioOptionCardFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionCardFormFieldModule {}
