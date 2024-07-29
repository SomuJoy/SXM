import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericalInputWithTooltipFormFieldComponent } from './numerical-input-with-tooltip-form-field/numerical-input-with-tooltip-form-field.component';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiTooltipModule, SharedSxmUiUiInputFocusModule, SharedSxmUiUiTrimFormFieldModule],
    declarations: [NumericalInputWithTooltipFormFieldComponent],
    exports: [NumericalInputWithTooltipFormFieldComponent]
})
export class SharedSxmUiUiNumericalInputWithTooltipFormFieldModule {}
