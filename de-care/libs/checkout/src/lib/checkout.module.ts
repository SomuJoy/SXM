import { DomainsAccountUiRegisterWidgetModule } from '@de-care/domains/account/ui-register-widget';
import { DomainsOffersStateOffersInfoModule } from '@de-care/domains/offers/state-offers-info';
import { DomainsOffersStateUpsellOffersInfoModule } from '@de-care/domains/offers/state-upsell-offers-info';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PurchaseModule } from '@de-care/purchase';
import { RtcResolver } from './rtc.resolver';
import { ThanksComponent } from './thanks/thanks.component';
import { LoadCheckoutFlepzResolver } from './load-checkout-flepz.resolver';
import { LoadCheckoutResolver } from './load-checkout.resolver';
import { CheckoutStateModule } from '@de-care/checkout-state';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { SalesCommonModule } from '@de-care/sales-common';
import { OffersModule } from '@de-care/offers';
import { IdentificationModule } from '@de-care/identification';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { SxmUiModule } from '@de-care/sxm-ui';
import { CanActivateStudentVerificationValidation } from './checkout-student-verification.guard';
import { CheckProgramCodesForNewBuyDigitalRedirect } from './check-program-codes-for-new-buy-digital-redirect';
import { CheckoutStreamingTokenResolver } from './checkout-streaming-token.resolver';
import { CheckoutSweepstakesResolver } from './checkout-sweepstakes.resolver';
import { RtcLandingPageComponent } from './rtc/rtc-landing-page/rtc-landing-page.component';
import { CanActivateConfirmationPage } from './can-activate-confirmation-page';
import { CustomerStateModule } from '@de-care/customer-state';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { CanActivateLoadEnvironmentInfo } from './can-activate-load-environment-info';
import { DeCareUseCasesCheckoutStateCheckoutTriageModule } from '@de-care/de-care-use-cases/checkout/state-checkout-triage';
import { SatelliteStreamingPurchasePageComponent } from './pages/satellite-streaming-purchase-page/satellite-streaming-purchase-page.component';
import { DomainsOffersStateFollowOnOffersModule } from '@de-care/domains/offers/state-follow-on-offers';
import { CanActivateLoadIpProvinceInfo } from './can-activate-load-ip-province-info';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { CheckoutFromRtcProactiveGuard } from './checkout-from-rtc-proactive.guard';
import { SharedSxmUiUiSxmInCarPlusStreamingModule } from '@de-care/shared/sxm-ui/ui-sxm-in-car-plus-streaming';
import { LeadOfferPlanSelectionPageComponent } from './pages/lead-offer-plan-selection-page/lead-offer-plan-selection-page.component';
import { CanActivateLeadOfferPlanSelectionPage } from './can-activate-lead-offer-plan-selection-page';
import { SharedSxmUiUiPickAPlanFormModule } from '@de-care/shared/sxm-ui/ui-pick-a-plan-form';
import { SxmUiPlanComparisonGridDetailedComponentModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid-detailed';
import { CheckoutFromPickAPlanProactiveGuard } from './checkout-from-pick-a-plan-proactive.guard';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { IneligibleErrorPageComponent } from './pages/ineligible-error-page/ineligible-error-page.component';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { LayoutMainComponent, LayoutMainComponentModule } from './layout-main/layout-main.component';
import {
    UpdateUsecaseCanActivateService,
    LoadCardBinRangesAsyncCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { ReactiveComponentModule } from '@ngrx/component';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { RedirectToTargetedFlowCanActivateService } from '@de-care/de-care-use-cases/checkout/feature-satellite';
import { SharedSxmUiUiFollowOnSelectionModule } from '@de-care/shared/sxm-ui/ui-follow-on-selection';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', redirectTo: 'checkout', pathMatch: 'full' },
            {
                path: '',
                component: LayoutMainComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPackageDescriptionsCanActivateService],
                children: [
                    {
                        path: 'checkout',
                        component: SatelliteStreamingPurchasePageComponent,
                        canActivate: [LoadCardBinRangesAsyncCanActivateService, CanActivateLoadEnvironmentInfo],
                        resolve: {
                            checkoutState: LoadCheckoutResolver,
                            sweepstakes: CheckoutSweepstakesResolver,
                        },
                        data: {
                            isFlepz: false,
                        },
                    },
                    {
                        path: 'checkout/flepz',
                        component: SatelliteStreamingPurchasePageComponent,
                        canActivate: [
                            LoadCardBinRangesAsyncCanActivateService,
                            CanActivateLoadEnvironmentInfo,
                            CanActivateLoadIpProvinceInfo,
                            UpdateUsecaseCanActivateService,
                            RedirectToTargetedFlowCanActivateService,
                        ],
                        resolve: {
                            checkoutState: LoadCheckoutFlepzResolver,
                        },
                        data: {
                            isFlepz: true,
                            useCaseKey: 'SATELLITE_ORGANIC',
                        },
                    },
                    {
                        path: 'checkout/streaming',
                        component: SatelliteStreamingPurchasePageComponent,
                        canActivate: [
                            LoadCardBinRangesAsyncCanActivateService,
                            CheckProgramCodesForNewBuyDigitalRedirect,
                            CanActivateLoadIpProvinceInfo,
                            CanActivateStudentVerificationValidation,
                        ],
                        resolve: {
                            streamingTokenData: CheckoutStreamingTokenResolver,
                        },
                        data: {
                            isStreaming: true,
                        },
                    },
                    {
                        path: 'checkout/thanks',
                        component: ThanksComponent,
                        canActivate: [CanActivateConfirmationPage, CanActivateLoadEnvironmentInfo],
                    },
                    {
                        path: 'checkout/renewal',
                        component: RtcLandingPageComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                        resolve: {
                            rtcData: RtcResolver,
                        },
                        data: {
                            useCaseKey: 'SATELLITE_ORGANIC',
                        },
                    },
                    {
                        path: 'checkout/from-rtc-proactive',
                        canActivate: [CheckoutFromRtcProactiveGuard],
                        component: PageProcessingMessageComponent,
                    },
                    {
                        path: 'checkout/from-pick-a-plan-proactive',
                        canActivate: [CheckoutFromPickAPlanProactiveGuard],
                        component: PageProcessingMessageComponent,
                    },
                    {
                        path: 'checkout/offer',
                        component: LeadOfferPlanSelectionPageComponent,
                        canActivate: [CanActivateLeadOfferPlanSelectionPage, CanActivateLoadEnvironmentInfo, UpdateUsecaseCanActivateService],
                        data: {
                            useCaseKey: 'SATELLITE_TARGETED',
                        },
                    },
                    {
                        path: 'checkout/streaming/ineligible-redirect',
                        component: IneligibleErrorPageComponent,
                    },
                    {
                        path: 'checkout/flepz/ineligible-redirect',
                        component: IneligibleErrorPageComponent,
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DomainsOffersStatePackageDescriptionsModule,
        PurchaseModule,
        CheckoutStateModule,
        CustomerStateModule,
        DomainsOffersStateOffersModule,
        SalesCommonModule,
        OffersModule,
        IdentificationModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsQuotesUiOrderSummaryModule,
        FeatureToggleModule,
        SxmUiModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DomainsAccountStateAccountModule,
        DeCareUseCasesCheckoutStateCheckoutTriageModule,
        DomainsOffersStateFollowOnOffersModule,
        DomainsOffersStateOffersInfoModule,
        DomainsOffersStateUpsellOffersInfoModule,
        DomainsAccountStateSecurityQuestionsModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiHeroModule,
        SharedSxmUiUiDealAddonCardModule,
        SharedSxmUiUiSxmInCarPlusStreamingModule,
        SharedSxmUiUiPickAPlanFormModule,
        SxmUiPlanComparisonGridDetailedComponentModule,
        DomainsAccountUiRegisterWidgetModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SharedSxmUiUiDataClickTrackModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        // TODO: replace this with newer page shell
        LayoutMainComponentModule,
        ReactiveComponentModule,
        SharedSxmUiUiFollowOnSelectionModule,
    ],
    declarations: [SatelliteStreamingPurchasePageComponent, ThanksComponent, RtcLandingPageComponent, LeadOfferPlanSelectionPageComponent, IneligibleErrorPageComponent],
    providers: [RtcResolver, CheckoutFromRtcProactiveGuard, CheckoutFromPickAPlanProactiveGuard],
})
export class CheckoutModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/checkout.en-CA.json'),
            'en-US': require('./i18n/checkout.en-US.json'),
            'fr-CA': require('./i18n/checkout.fr-CA.json'),
        };
        super(translateService, languages);

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(true);
        }
    }
}
