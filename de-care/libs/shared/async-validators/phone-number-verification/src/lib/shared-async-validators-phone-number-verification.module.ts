import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedStateSettingsModule } from '@de-care/shared/state-settings';
import { VerifyPhoneService } from './data-services/verify-phone.service';
import { VerifyPhoneWorkFlowService } from './workflows/verify-phone.workflow';
import { PhoneNumberAsyncValidator } from './verify-phone-async-validator.service';

@NgModule({
    imports: [CommonModule, SharedStateSettingsModule],
    providers: [VerifyPhoneService, VerifyPhoneWorkFlowService, PhoneNumberAsyncValidator]
})
export class SharedAsyncValidatorsPhoneNumberVerificationModule {}
