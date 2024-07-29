import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiTrimFormFieldModule } from '@de-care/shared/sxm-ui/ui-trim-form-field';
import { TextInputWithTooltipFormFieldComponent } from './text-input-with-tooltip-form-field/text-input-with-tooltip-form-field.component';
import { SharedSxmUiUiIconToolTipModule } from '@de-care/shared/sxm-ui/ui-icon-tool-tip';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiTooltipModule, SharedSxmUiUiInputFocusModule, SharedSxmUiUiTrimFormFieldModule, SharedSxmUiUiIconToolTipModule],
    declarations: [TextInputWithTooltipFormFieldComponent],
    exports: [TextInputWithTooltipFormFieldComponent],
})
export class SharedSxmUiUiTextInputWithTooltipFormFieldModule {}
