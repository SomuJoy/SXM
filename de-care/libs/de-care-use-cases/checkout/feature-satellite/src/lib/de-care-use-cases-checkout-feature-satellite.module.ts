import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import {
    DisableRoutingLoaderCanActivateService,
    LoadCardBinRangesAsyncCanActivateService,
    LoadEnvironmentInfoCanActivateService,
    LoadIpLocationCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    UpdateUsecaseCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesCheckoutStateSatelliteModule } from '@de-care/de-care-use-cases/checkout/state-satellite';
import { PurchaseOrganicPageComponent } from './pages/purchase-organic-page/purchase-organic-page.component';
import { PurchaseTargetedPageComponent } from './pages/purchase-targeted-page/purchase-targeted-page.component';
import { SharedSxmUiUiAccordionStepperModule } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { PurchaseOrganicCanActivateService } from './pages/purchase-organic-page/purchase-organic-can-activate.service';
import { PurchaseTargetedCanActivateService } from './pages/purchase-targeted-page/purchase-targeted-can-activate.service';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { ConfirmationCanActivateService } from './pages/confirmation-page/confirmation-can-activate.service';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { SharedSxmUiUiOfferGridModule } from '@de-care/shared/sxm-ui/ui-offer-grid';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    ErrorPagesModule,
    ExpiredOfferErrorPageComponent,
    GenericErrorPageComponent,
    HidePageLoaderCanActivateService,
    IneligibleErrorPageComponent,
    PromoCodeRedeemedErrorPageComponent,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { ActiveSubscriptionFoundPageComponent } from './pages/active-subscription-found-page/active-subscription-found-page.component';
import { ActiveSubscriptionFoundCanActivateService } from './pages/active-subscription-found-page/active-subscription-found-can-activate.service';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { IdentificationModule } from '@de-care/identification';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { StepOfferPresentmentPageComponent } from './pages/step-offer-presentment-page/step-offer-presentment-page.component';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { PageStepRouteConfiguration } from './routing/page-step-route-configuration';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { StepTargetedPaymentInterstitialPageComponent } from './pages/step-targeted-payment-interstitial-page/step-targeted-payment-interstitial-page.component';
import { StepTargetedReviewPageComponent } from './pages/step-targeted-review-page/step-targeted-review-page.component';
import { SxmUiVehicleYmmInfoComponentModule } from '@de-care/shared/sxm-ui/ui-vehicle-ymm-info';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'targeted',
                data: { useCaseKey: 'SATELLITE_TARGETED' },
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    LoadEnvironmentInfoCanActivateService,
                    LoadPackageDescriptionsCanActivateService,
                    LoadIpLocationCanActivateService,
                    DisableRoutingLoaderCanActivateService,
                    UpdateUsecaseCanActivateService,
                    PurchaseTargetedCanActivateService,
                ],
                children: [
                    {
                        path: 'offer',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { allowProvinceBar: true } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: StepOfferPresentmentPageComponent,
                                data: {
                                    pageStepConfiguration: {
                                        totalNumberOfSteps: 1,
                                        currentStepNumber: 1,
                                        routeUrlNext: '../payment',
                                    } as PageStepRouteConfiguration,
                                },
                            },
                        ],
                    },
                    {
                        path: 'payment',
                        component: PageShellBasicComponent,
                        children: [
                            {
                                path: '',
                                component: PurchaseTargetedPageComponent,
                                canActivate: [LoadCardBinRangesAsyncCanActivateService],
                                data: { hideHero: true, hideOfferPresentment: true, hideSelectedPlanSummary: true, routeUrlNext: '../thanks' },
                            },
                        ],
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                        children: [{ path: '', component: PurchaseTargetedPageComponent, canActivate: [LoadCardBinRangesAsyncCanActivateService] }],
                    },
                ],
            },
            {
                path: '',
                canActivate: [
                    TempIncludeGlobalStyleScriptCanActivateService,
                    LoadEnvironmentInfoCanActivateService,
                    LoadPackageDescriptionsCanActivateService,
                    LoadIpLocationCanActivateService,
                ],
                children: [
                    {
                        path: 'ineligible-redirect',
                        pathMatch: 'full',
                        component: IneligibleErrorPageComponent,
                    },
                    {
                        path: 'generic-error',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: GenericErrorPageComponent,
                                data: { ctaURL: 'subscribe/checkout/flepz' },
                                canActivate: [HidePageLoaderCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'expired-offer-error',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: ExpiredOfferErrorPageComponent,
                                data: { ctaURL: 'subscribe/checkout/flepz' },
                                canActivate: [HidePageLoaderCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'promo-code-redeemed-error',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: PromoCodeRedeemedErrorPageComponent,
                                data: { ctaURL: 'subscribe/checkout/flepz' },
                                canActivate: [HidePageLoaderCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'targeted/active-subscription',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: ActiveSubscriptionFoundPageComponent,
                                canActivate: [ActiveSubscriptionFoundCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'targeted/thanks',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: ConfirmationPageComponent,
                                canActivate: [ConfirmationCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'organic',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: {
                            useCaseKey: 'SATELLITE_ORGANIC',
                            pageShellBasic: { headerTheme: 'black' } as PageShellBasicRouteConfiguration,
                        },
                        canActivate: [UpdateUsecaseCanActivateService],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: PurchaseOrganicPageComponent,
                                canActivate: [LoadCardBinRangesAsyncCanActivateService, PurchaseOrganicCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'organic/thanks',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: ConfirmationPageComponent,
                                canActivate: [ConfirmationCanActivateService],
                            },
                        ],
                    },
                ],
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        ReactiveComponentModule,
        DeCareSharedUiPageShellBasicModule,
        DeCareUseCasesCheckoutStateSatelliteModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedSxmUiUiAccordionStepperModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiOfferGridModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        SharedSxmUiUiLoadingOverlayModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SharedSxmUiUiAlertPillModule,
        ErrorPagesModule,

        // TODO: need to look in to updating this module so it doesn't depend on the old SxmUi module
        DomainsQuotesUiOrderSummaryModule,

        // TODO: Need to work on replacing this with a domain lib for identification
        IdentificationModule,
        DomainsAccountUiRegisterModule,
        DeCareSharedUiPageLayoutModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiDealAddonCardModule,
        SxmUiVehicleYmmInfoComponentModule,
        StepOfferPresentmentPageComponent,
        StepTargetedPaymentInterstitialPageComponent,
        StepTargetedReviewPageComponent,
    ],
    declarations: [PurchaseOrganicPageComponent, PurchaseTargetedPageComponent, ConfirmationPageComponent, ActiveSubscriptionFoundPageComponent],
})
export class DeCareUseCasesCheckoutFeatureSatelliteModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
