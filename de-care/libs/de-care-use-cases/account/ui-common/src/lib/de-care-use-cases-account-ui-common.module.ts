import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule } from '@de-care/shared/sxm-ui/ui-charge-agreement-generic-checkbox-form-field';
import { SharedSxmUiBalanceInfoComponentModule } from '@de-care/shared/sxm-ui/ui-balance-info';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { BalanceAndPaymentInfoFormComponent } from './balance-and-payment-info-form/balance-and-payment-info-form.component';
import { SharedSxmUiBillingEbillOptOutComponentModule, SharedSxmUiBillingEbillUpdateEmailComponentModule } from '@de-care/shared/sxm-ui/billing/ui-billing';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule,
        SharedSxmUiBalanceInfoComponentModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiBillingEbillUpdateEmailComponentModule,
        SharedSxmUiBillingEbillOptOutComponentModule,
    ],
    declarations: [BalanceAndPaymentInfoFormComponent],
    exports: [BalanceAndPaymentInfoFormComponent],
})
export class DeCareUseCasesAccountUiCommonModule {}
