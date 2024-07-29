import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioOptionWithTooltipFormFieldSetComponent } from './radio-option-with-tooltip-form-field-set/radio-option-with-tooltip-form-field-set.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-with-tooltip-form-field';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiRadioOptionWithTooltipFormFieldModule],
    declarations: [RadioOptionWithTooltipFormFieldSetComponent],
    exports: [RadioOptionWithTooltipFormFieldSetComponent]
})
export class SharedSxmUiUiRadioOptionWithTooltipFormFieldSetModule {}
