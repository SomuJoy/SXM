import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SelectPlanByTermFormComponent } from './select-plan-by-term-form/select-plan-by-term-form.component';
import { UpdatePriceAndTermPipe } from './select-plan-by-term-form/update-price-and-term.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [SelectPlanByTermFormComponent, UpdatePriceAndTermPipe],
    exports: [SelectPlanByTermFormComponent],
})
export class SharedSxmUiFormsUiSelectPlanByTermFormModule {}
