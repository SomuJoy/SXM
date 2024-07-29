import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { TranslateModule } from '@ngx-translate/core';
import { DeCareUseCasesAccountStateMyAccountSubscriptionsModule } from '@de-care/de-care-use-cases/account/state-my-account-subscriptions';
import { SubscriptionsPageComponent } from './pages/subscriptions-page/subscriptions-page.component';
import {
    SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule,
    SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule,
    SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiAviationSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiTrialSubscriptionSingleActionModule,
    SharedSxmUiSubscriptionsUiAddSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule,
    SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiAddNicknameFormModule,
    SharedSxmUiSubscriptionsUiAppUsernameActionModule,
    SharedSxmUiSubscriptionsUiDontSeeYourRadioModule,
    SharedSxmUiSubscriptionsUiInactiveStreamingSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiNewSubscriptionActionsModule,
    SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule,
    SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule,
    SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule,
} from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscriptions';
import { SharedSxmUiUiMyAccountCardModule } from '@de-care/shared/sxm-ui/ui-my-account-card';
import { SubscriptionCardListComponent } from './common/subscription-card-list/subscription-card-list.component';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SubscriptionDetailsPageComponent } from './pages/subscription-details-page/subscription-details-page.component';
import { SubscriptionDetailsCanActivateService } from './pages/subscription-details-page/subscription-details-can-activate';
import {
    SharedSxmUiSubscriptionDetailsUiSelfpaySubscriptionDetailsModule,
    SharedSxmUiSubscriptionDetailsUiTrialSubscriptionDetailsModule,
    SharedSxmUiSubscriptionDetailsUiPromoSubscriptionDetailsModule,
    SharedSxmUiPvipSubscriptionIncludesModule,
    SxmUiPriceChangeMessageComponentModule,
} from '@de-care/shared/sxm-ui/subscriptions/ui-account-subscription-details';
import {
    SharedSxmUiManageStreamingSubscriptionHeaderModule,
    SharedSxmUiManageSubscriptionHeaderModule,
    SharedSxmUiManageSubscriptionHeaderWithNicknameModule,
    SharedSxmUiManageSubscriptionHeaderWithRadioIdModule,
    SharedSxmUiManageSubscriptionHeaderWithYmmModule,
} from '@de-care/shared/sxm-ui/subscriptions/ui-manage-account-subscriptions';
import { SubscriptionsPageCanActivateService } from './pages/subscriptions-page/subscriptions-page-can-activate.service';
import { CancelModalComponent } from './page-parts/cancel-modal/cancel-modal.component';
import { DeCareUseCasesAccountUiMyAccountModule } from '@de-care/de-care-use-cases/account/ui-my-account';
import { SpecialCancelModalComponent } from './page-parts/special-cancel-modal/special-cancel-modal.component';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { CancelPVIPModalComponent } from './page-parts/cancel-pvip-modal/cancel-pvip-modal.component';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        ReactiveComponentModule,
        RouterModule.forChild([
            { path: '', component: SubscriptionsPageComponent, canActivate: [SubscriptionsPageCanActivateService] },
            // TODO: if sub details page can be loaded directly with a subId in the param, then this route needs to be able to load all the dependencies from the other routes
            {
                path: 'details',
                component: SubscriptionDetailsPageComponent,
                canActivate: [SubscriptionDetailsCanActivateService],
                children: [
                    {
                        path: 'cancel',
                        component: CancelModalComponent,
                        outlet: 'modal',
                    },
                    {
                        path: 'paymentAlert',
                        component: SpecialCancelModalComponent,
                        outlet: 'modal',
                    },
                    {
                        path: 'cancelPvipAlert',
                        component: CancelPVIPModalComponent,
                        outlet: 'modal',
                    },
                ],
            },
        ]),
        DeCareUseCasesAccountStateMyAccountSubscriptionsModule,
        SharedSxmUiSubscriptionsUiActiveSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiUpgradeSubscriptionSingleActionModule,
        SharedSxmUiSubscriptionsUiActivateRadioSingleActionModule,
        SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiAviationSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiMarineSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiTrialSubscriptionSingleActionModule,
        SharedSxmUiSubscriptionsUiAddSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiStreamingSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiInactiveStreamingSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule,
        SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule,
        SharedSxmUiSubscriptionsUiAddNicknameFormModule,
        SharedSxmUiUiMyAccountCardModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiSubscriptionsUiRemoveInactiveRadioFormModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiManageStreamingSubscriptionHeaderModule,
        SharedSxmUiManageSubscriptionHeaderModule,
        SharedSxmUiManageSubscriptionHeaderWithNicknameModule,
        SharedSxmUiManageSubscriptionHeaderWithRadioIdModule,
        SharedSxmUiManageSubscriptionHeaderWithYmmModule,
        SharedSxmUiSubscriptionDetailsUiSelfpaySubscriptionDetailsModule,
        SharedSxmUiSubscriptionDetailsUiTrialSubscriptionDetailsModule,
        SharedSxmUiSubscriptionsUiAppUsernameActionModule,
        SharedSxmUiSubscriptionDetailsUiPromoSubscriptionDetailsModule,
        SxmUiPriceChangeMessageComponentModule,
        SharedSxmUiSubscriptionsUiDontSeeYourRadioModule,
        SharedSxmUiPvipSubscriptionIncludesModule,
        DeCareUseCasesAccountUiMyAccountModule,
        SharedSxmUiSubscriptionsUiNewSubscriptionActionsModule,
        SharedSxmUiSubscriptionsUiReactivateSeasonalSuspendedSubscriptionsModule,
        DomainsChatUiChatWithAgentLinkModule,
    ],
    declarations: [
        SubscriptionsPageComponent,
        SubscriptionCardListComponent,
        SubscriptionDetailsPageComponent,
        CancelModalComponent,
        SpecialCancelModalComponent,
        CancelPVIPModalComponent,
    ],
})
export class DeCareUseCasesAccountFeatureMyAccountSubscriptionsModule {}
