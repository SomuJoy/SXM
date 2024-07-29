import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyYourAccountFormFieldsComponent } from './verify-your-account-form-fields/verify-your-account-form-fields.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        SharedSxmUiUiDataClickTrackModule,
    ],
    declarations: [VerifyYourAccountFormFieldsComponent],
    exports: [VerifyYourAccountFormFieldsComponent],
})
export class SharedSxmUiUiVerifyYourAccountFormFieldsModule {}
