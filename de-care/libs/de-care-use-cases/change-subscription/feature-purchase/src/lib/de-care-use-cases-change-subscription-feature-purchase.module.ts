import { NgModule } from '@angular/core';
import { CustomerInfoModule } from '@de-care/customer-info';
import { DomainsAccountUiYourCurrentPlanModule } from '@de-care/domains/account/ui-your-current-plan';
import { OffersModule } from '@de-care/offers';
import { DeCareUseCasesChangeSubscriptionStatePurchaseModule } from '@de-care/de-care-use-cases/change-subscription/state-purchase';
import { SxmUiModule } from '@de-care/sxm-ui';
import { ChangeSubscriptionPurchasePageComponent } from './pages/change-subscription-purchase-page/change-subscription-purchase-page.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { CommonModule } from '@angular/common';
import { DeCareUseCasesChangeSubscriptionUiCommonModule } from '@de-care/de-care-use-cases/change-subscription/ui-common';
import { RouterModule } from '@angular/router';
import { PurchaseFlowGuardService } from './purchase-flow-guard.service';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { SalesCommonModule } from '@de-care/sales-common';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { ReviewOrderModule } from '@de-care/review-order';
import { DomainsOffersUiGetDiffExcludedChannelsPipeModule } from '@de-care/domains/offers/ui-get-diff-excluded-channels-pipe';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { DomainsOffersUiOfferInfotainmentFormModule } from '@de-care/domains/offers/ui-offer-infotainment-form';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { DomainsOffersUiPriceIncreaseMessageModule } from '@de-care/domains/offers/ui-price-increase-message';
import { DomainsOffersUiOfferFormsModule } from '@de-care/domains/offers/ui-offer-forms';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DomainsOffersUiPromoCodeValidationFormModule } from '@de-care/domains/offers/ui-promo-code-validation-form';
import { LoadCardBinRangesAsyncCanActivateService, TurnOnFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                pathMatch: 'full',
                canActivate: [TurnOnFullPageLoaderCanActivateService, LoadCardBinRangesAsyncCanActivateService, PurchaseFlowGuardService],
                component: ChangeSubscriptionPurchasePageComponent,
            },
            {
                path: 'thanks',
                component: ConfirmationPageComponent,
            },
        ]),
        DeCareUseCasesChangeSubscriptionStatePurchaseModule,
        TranslateModule.forChild(),
        CommonModule,
        DeCareUseCasesChangeSubscriptionUiCommonModule,
        DomainsOffersUiHeroModule,
        CustomerInfoModule,
        SalesCommonModule,
        DomainsQuotesUiOrderSummaryModule,
        DomainsAccountUiYourCurrentPlanModule,
        FeatureToggleModule,
        SxmUiModule,
        OffersModule,
        ReviewOrderModule,
        DomainsOffersUiGetDiffExcludedChannelsPipeModule,
        DomainsOffersUiOfferInfotainmentFormModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiAlertPillModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiLegalCopyModule,
        DomainsOffersUiPriceIncreaseMessageModule,
        DomainsOffersUiOfferFormsModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        DomainsOffersUiPromoCodeValidationFormModule,
        DomainsDeviceUiRefreshDeviceModule,
        ReactiveComponentModule,
    ],
    declarations: [ChangeSubscriptionPurchasePageComponent, ConfirmationPageComponent],
})
export class DeCareUseCasesChangeSubscriptionFeaturePurchaseModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/feature-purchase.en-CA.json') },
            'en-US': { ...require('./i18n/feature-purchase.en-US.json') },
            'fr-CA': { ...require('./i18n/feature-purchase.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
