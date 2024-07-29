import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DeCareUseCasesAccountStatePaymentModule } from '@de-care/de-care-use-cases/account/state-payment';
import { SubmitPaymentPageComponent } from './pages/submit-payment-page/submit-payment-page.component';
import { SubmitPaymentCanActivateService } from './pages/submit-payment-page/submit-payment-can-activate.service';
import { DeCarePageShellAccountPresenceModule, PageShellAccountPresenceComponent } from '@de-care/de-care/shared/ui-page-shell-account-presence';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule } from '@de-care/shared/sxm-ui/ui-charge-agreement-generic-checkbox-form-field';
import { SharedSxmUiBalanceInfoComponentModule } from '@de-care/shared/sxm-ui/ui-balance-info';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { DeCareUseCasesAccountUiCommonModule } from '@de-care/de-care-use-cases/account/ui-common';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { ConfirmationPageCanActivateService } from './pages/confirmation-page/confirmation-page-can-activate.service';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'make-payment',
                component: PageShellAccountPresenceComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, SubmitPaymentCanActivateService],
                children: [
                    {
                        path: '',
                        component: SubmitPaymentPageComponent,
                    },
                    {
                        path: 'thankyou',
                        canActivate: [ConfirmationPageCanActivateService],
                        component: ConfirmationPageComponent,
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        ReactiveComponentModule,
        DeCarePageShellAccountPresenceModule,
        ReactiveFormsModule,
        DeCareUseCasesAccountStatePaymentModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule,
        SharedSxmUiBalanceInfoComponentModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiAlertPillModule,
        DeCareUseCasesAccountUiCommonModule,
        DomainsDeviceUiRefreshDeviceModule,
    ],
    declarations: [SubmitPaymentPageComponent, ConfirmationPageComponent],
})
export class DeCareUseCasesAccountFeaturePaymentModule {}
