import { NgModule } from '@angular/core';
import { CancelSubscriptionPageComponent } from './pages/cancel-subscription-page/cancel-subscription-page.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { CommonModule } from '@angular/common';
import { DomainsCancellationUiCancelModule } from '@de-care/domains/cancellation/ui-cancel';
import { SxmUiModule } from '@de-care/sxm-ui';
import { Route, RouterModule } from '@angular/router';
import { CancelRequestFlowGuardService } from './cancel-request-flow-guard.service';
import { DeCareUseCasesCancelSubscriptionStateCancelRequestModule } from '@de-care/de-care-use-cases/cancel-subscription/state-cancel-request';
import { DomainsAccountUiYourCurrentPlanModule } from '@de-care/domains/account/ui-your-current-plan';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { OffersModule } from '@de-care/offers';
import { AcceptOfferFlowComponent } from './page-parts/accept-offer-flow/accept-offer-flow.component';
import { CustomerInfoModule } from '@de-care/customer-info';
import { SalesCommonModule } from '@de-care/sales-common';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { ReviewOrderModule } from '@de-care/review-order';
import { AcceptOfferConfirmationPageComponent } from './pages/accept-offer-confirmation-page/accept-offer-confirmation-page.component';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DomainsOffersUiPackageDescriptionsModule } from '@de-care/domains/offers/ui-package-descriptions';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiPlanSelectionModule } from '@de-care/shared/sxm-ui/ui-plan-selection';
import { SharedSxmUiUiPlanComparisonGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';
import { SharedSxmUiUiPlanComparisonEnhancedGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-enhanced-grid';
import { SharedSxmUiUiImageCarouselModule } from '@de-care/shared/sxm-ui/ui-image-carousel';
import { SharedSxmUiUiChooseGenreFormModule } from '@de-care/shared/sxm-ui/ui-choose-genre-form';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DomainsOffersUiOfferFormsModule } from '@de-care/domains/offers/ui-offer-forms';
import { PreSelectedPlanComponent } from './page-parts/pre-selected-plan/pre-selected-plan.component';
import { SharedSxmUiFormsUiSelectPlanByTermFormModule } from '@de-care/shared-sxm-ui-forms-ui-select-plan-by-term-form';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { InterstitialChannelBlocksComponent } from './page-parts/interstitial-channel-blocks/interstitial-channel-blocks.component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import {
    LoadCardBinRangesAsyncCanActivateService,
    TurnOnFullPageLoaderCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ReactiveComponentModule } from '@ngrx/component';
import { PreSelectedSecondPlanComponent } from './page-parts/pre-selected-second-plan/pre-selected-second-plan.component';
import { ModalCancelPlanComparisonGridComponent } from './page-parts/modal-cancel-plan-comparison-grid/modal-cancel-plan-comparison-grid.component';
import { SharedSxmUiUiPlanSelectionEnhancedModule } from '@de-care/shared/sxm-ui/ui-plan-selection-enhanced';
import { SxmUiPlanComparisonGridDetailedComponentModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid-detailed';
import { OffersPresentmentComponent } from './page-parts/offers-presentment/offers-presentment.component';
import { SxmUiYourCurrentPlanComponent } from '@de-care/shared/sxm-ui/ui-your-current-plan';
import { CancelSummaryComponent } from './page-parts/cancel-summary/cancel-summary.component';
import { CancelConfirmationComponent } from './page-parts/cancel-confirmation/cancel-confirmation.component';

const routes: Route[] = [
    {
        path: '',
        component: CancelSubscriptionPageComponent,
        canActivate: [TurnOnFullPageLoaderCanActivateService, LoadCardBinRangesAsyncCanActivateService, CancelRequestFlowGuardService],
        children: [
            {
                path: 'grid',
                component: ModalCancelPlanComparisonGridComponent,
                outlet: 'modal',
                canActivate: [TurnOffFullPageLoaderCanActivateService],
            },
        ],
    },
    {
        path: 'thanks',
        component: AcceptOfferConfirmationPageComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        DeCareUseCasesCancelSubscriptionStateCancelRequestModule,
        DomainsCancellationUiCancelModule,
        FeatureToggleModule,
        SxmUiModule,
        DomainsAccountUiYourCurrentPlanModule,
        DomainsOffersStateOffersModule,
        OffersModule,
        CustomerInfoModule,
        SalesCommonModule,
        DomainsQuotesUiOrderSummaryModule,
        ReviewOrderModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsOffersUiPackageDescriptionsModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiPlanSelectionModule,
        SharedSxmUiUiPlanComparisonGridModule,
        SharedSxmUiUiPlanComparisonEnhancedGridModule,
        SharedSxmUiUiChooseGenreFormModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        DomainsOffersUiOfferFormsModule,
        SharedSxmUiFormsUiSelectPlanByTermFormModule,
        SharedSxmUiUiImageCarouselModule,
        SharedSxmUiUiAlertPillModule,
        ReactiveComponentModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiPlanSelectionEnhancedModule,
        SxmUiPlanComparisonGridDetailedComponentModule,
        OffersPresentmentComponent,
        SxmUiYourCurrentPlanComponent,
        CancelSummaryComponent,
        CancelConfirmationComponent,
    ],
    declarations: [
        CancelSubscriptionPageComponent,
        AcceptOfferFlowComponent,
        AcceptOfferConfirmationPageComponent,
        PreSelectedPlanComponent,
        InterstitialChannelBlocksComponent,
        PreSelectedSecondPlanComponent,
        ModalCancelPlanComparisonGridComponent,
    ],
    providers: [CancelRequestFlowGuardService],
})
export class DeCareUseCasesCancelSubscriptionFeatureCancelRequestModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/feature-cancel-request.en-CA.json') },
            'en-US': { ...require('./i18n/feature-cancel-request.en-US.json') },
            'fr-CA': { ...require('./i18n/feature-cancel-request.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
