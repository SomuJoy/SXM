import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { RadioOptionCardWithAccordionFormFieldComponent } from './radio-option-card-with-accordion-form-field/radio-option-card-with-accordion-form-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedSxmUiUiAccordionChevronModule, SharedSxmUiUiContentCardModule],
    declarations: [RadioOptionCardWithAccordionFormFieldComponent],
    exports: [RadioOptionCardWithAccordionFormFieldComponent]
})
export class SharedSxmUiUiRadioOptionCardWithAccordionFormFieldModule {}
