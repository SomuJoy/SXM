import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiCredentialRecoveryComponent } from './credential-recovery/credential-recovery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule.forChild(), SharedSxmUiUiProceedButtonModule, SharedSxmUiUiRadioOptionFormFieldModule],
    declarations: [SxmUiCredentialRecoveryComponent],
    exports: [SxmUiCredentialRecoveryComponent],
})
export class SharedSxmUiUiCredentialRecoveryFormFieldsModule {}
