import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveComponentModule } from '@ngrx/component';
import { DeCareUseCasesAccountStateMyAccountDashboardModule } from '@de-care/de-care-use-cases/account/state-my-account-dashboard';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { BillingSectionComponent } from './page-parts/billing-section/billing-section.component';
import { SubscriptionsSectionComponent } from './page-parts/subscriptions-section/subscriptions-section.component';
import {
    SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule,
    SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule,
    SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiAviationSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiTrialSubscriptionSingleActionModule,
    SharedSxmUiSubscriptionsUiAddSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule,
    SharedSxmUiSubscriptionsUiInactiveStreamingSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumVipModule,
    SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumTwoDeviceBundleModule,
    SharedSxmUiSubscriptionsUiNewSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule,
    SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule,
    SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule,
} from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscriptions';
import {
    SharedSxmUiBillingBillingFooterModule,
    SharedSxmUiBillingBillingWithAutomatedPaymentModule,
    SharedSxmUiBillingBillingWithNoPaymentDueModule,
    SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule,
    SharedSxmUiBillingBillingWithMakePaymentModule,
    SharedSxmUiBillingBillingWithTrialerNoPaymentDueWithFollowonModule,
    SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule,
} from '@de-care/shared/sxm-ui/billing/ui-billing';
import { SharedSxmUiUiMyAccountCardModule } from '@de-care/shared/sxm-ui/ui-my-account-card';
import { SharedSxmUiAccountHelpFaqCardModule, SxmUiAccountHelpWithRightArrowIconModule } from '@de-care/shared/sxm-ui/help/ui-account-help';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { DeCareUseCasesAccountStateMyAccountSubscriptionsModule } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
import { DeCareUseCasesAccountUiMyAccountModule, MyAccountInnerStripComponentModule } from '@de-care/de-care-use-cases/account/ui-my-account';
import { SharedSxmUiImageWithCaptionComponentModule } from '@de-care/shared/sxm-ui/marketing/ui-marketing';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild([{ path: '', component: DashboardPageComponent }]),
        ReactiveComponentModule,
        DeCareUseCasesAccountStateMyAccountDashboardModule,
        SharedSxmUiBillingBillingFooterModule,
        SharedSxmUiBillingBillingWithAutomatedPaymentModule,
        SharedSxmUiBillingBillingWithNoPaymentDueModule,
        SharedSxmUiBillingBillingWithMakePaymentModule,
        SharedSxmUiBillingBillingWithTrialerNoPaymentDueWithFollowonModule,
        SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule,
        SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule,
        SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule,
        SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiAviationSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiTrialSubscriptionSingleActionModule,
        SharedSxmUiSubscriptionsUiAddSubscriptionActionsModule,
        SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule,
        SharedSxmUiUiMyAccountCardModule,
        SharedSxmUiAccountHelpFaqCardModule,
        SxmUiAccountHelpWithRightArrowIconModule,
        SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiInactiveStreamingSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule,
        SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule,
        DeCareUseCasesAccountStateMyAccountSubscriptionsModule,
        DeCareUseCasesAccountUiMyAccountModule,
        SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumVipModule,
        SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumTwoDeviceBundleModule,
        SharedSxmUiImageWithCaptionComponentModule,
        SharedSxmUiSubscriptionsUiNewSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule,
        MyAccountInnerStripComponentModule,
    ],
    declarations: [DashboardPageComponent, BillingSectionComponent, SubscriptionsSectionComponent],
})
export class DeCareUseCasesAccountFeatureMyAccountDashboardModule {}
