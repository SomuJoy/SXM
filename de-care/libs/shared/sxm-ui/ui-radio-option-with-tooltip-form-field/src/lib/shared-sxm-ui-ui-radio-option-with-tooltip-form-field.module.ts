import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioOptionWithTooltipFormFieldComponent } from './radio-option-with-tooltip-form-field/radio-option-with-tooltip-form-field.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiTooltipModule],
    declarations: [RadioOptionWithTooltipFormFieldComponent],
    exports: [RadioOptionWithTooltipFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionWithTooltipFormFieldModule {}
