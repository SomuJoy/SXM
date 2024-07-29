import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BillingPageComponent } from './pages/billing-page/billing-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeCareUseCasesAccountStateMyAccountBillingModule } from '@de-care/de-care-use-cases/account/state-my-account-billing';
import { SharedSxmUiUiDropdownFormFieldModule } from '@de-care/shared/sxm-ui/ui-dropdown-form-field';
import { BillingHistoryComponentModule } from './page-parts/billing-history/billing-history.component';
import { PaymentHistoryComponentModule } from './page-parts/payment-history/payment-history.component';
import { SharedSxmUiUiMyAccountCardModule } from '@de-care/shared/sxm-ui/ui-my-account-card';
import { MyAccountInnerStripComponentModule } from '@de-care/de-care-use-cases/account/ui-my-account';
import { SharedSxmUiUiToastNotificationModule } from '@de-care/shared/sxm-ui/ui-toast-notification';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import {
    SharedSxmUiBillingAddressActionComponentModule,
    SharedSxmUiEBillActionsComponentModule,
    SharedSxmUiEBillSignupSingleActionComponentModule,
    SharedSxmUiPaymentMethodActionComponentModule,
} from '@de-care/shared/sxm-ui/account/ui-account-information';
import {
    SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule,
    SharedSxmUiBillingEbillOptOutComponentModule,
    SharedSxmUiBillingEbillSignUpComponentModule,
    SharedSxmUiBillingEbillUpdateEmailComponentModule,
} from '@de-care/shared/sxm-ui/billing/ui-billing';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import {
    SharedSxmUiBillingBillingFooterModule,
    SharedSxmUiBillingBillingWithAutomatedPaymentModule,
    SharedSxmUiBillingBillingWithNoPaymentDueModule,
    SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule,
    SharedSxmUiBillingBillingWithMakePaymentModule,
    SharedSxmUiBillingBillingWithTrialerNoPaymentDueWithFollowonModule,
} from '@de-care/shared/sxm-ui/billing/ui-billing';
import { SharedSxmUiUiIconDropdownArrowSmallModule } from '@de-care/shared/sxm-ui/ui-icon-dropdown-arrow-small';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: BillingPageComponent,
                children: [
                    {
                        path: 'updateEmail',
                        loadComponent: () => import('@de-care/de-care-use-cases/account/ui-common').then((m) => m.UpdateEbillEmailComponent),
                        outlet: 'modal',
                    },
                    {
                        path: 'optOut',
                        loadComponent: () => import('@de-care/de-care-use-cases/account/ui-common').then((m) => m.EbillOptOutComponent),
                        outlet: 'modal',
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DeCareUseCasesAccountStateMyAccountBillingModule,
        SharedSxmUiUiDropdownFormFieldModule,
        BillingHistoryComponentModule,
        PaymentHistoryComponentModule,
        SharedSxmUiUiMyAccountCardModule,
        MyAccountInnerStripComponentModule,
        SharedSxmUiUiToastNotificationModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiBillingAddressActionComponentModule,
        SharedSxmUiEBillActionsComponentModule,
        SharedSxmUiEBillSignupSingleActionComponentModule,
        SharedSxmUiPaymentMethodActionComponentModule,
        ReactiveComponentModule,
        SharedSxmUiBillingEbillSignUpComponentModule,
        SharedSxmUiBillingEbillUpdateEmailComponentModule,
        SharedSxmUiBillingEbillOptOutComponentModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiBillingBillingFooterModule,
        SharedSxmUiBillingBillingWithAutomatedPaymentModule,
        SharedSxmUiBillingBillingWithNoPaymentDueModule,
        SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule,
        SharedSxmUiBillingBillingWithMakePaymentModule,
        SharedSxmUiBillingBillingWithTrialerNoPaymentDueWithFollowonModule,
        SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule,
        SharedSxmUiUiIconDropdownArrowSmallModule,
    ],
    declarations: [BillingPageComponent],
})
export class DeCareUseCasesAccountFeatureMyAccountBillingModule {}
