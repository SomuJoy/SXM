import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import {
    UpdateUsecaseCanActivateService,
    LoadIpLocationAndSetProvinceCanActivateService,
    DisableRoutingLoaderCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
    TurnOffFullPageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { DeCareUseCasesCheckoutStateStreamingModule } from '@de-care/de-care-use-cases/checkout/state-streaming';
import { SharedSxmUiUiAccordionStepperModule } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { ReactiveFormsModule } from '@angular/forms';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SxmUiButtonCtaComponentModule } from '@de-care/shared/sxm-ui/ui-button-cta';
import { ReactiveComponentModule } from '@ngrx/component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { SharedSxmUiUiPrimaryPackageCardModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { DomainsPaymentUiPrepaidRedeemModule } from '@de-care/domains/payment/ui-prepaid-redeem';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiListenOnDevicesModule } from '@de-care/shared/sxm-ui/ui-listen-on-devices';
import {
    DeCareUseCasesCheckoutUiCommonModule,
    IneligibleErrorPageComponent,
    GenericErrorPageComponent,
    ExpiredOfferErrorPageComponent,
    PromoCodeRedeemedErrorPageComponent,
    ErrorPagesModule,
    HidePageLoaderCanActivateService,
} from '@de-care/de-care-use-cases/checkout/ui-common';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { SharedSxmUiUiDealAddonCardModule } from '@de-care/shared/sxm-ui/ui-deal-addon-card';
import { DomainsOffersUiOfferFormsModule } from '@de-care/domains/offers/ui-offer-forms';
import { purchaseTargetedMrdRouting } from './routing/purchase-targeted-mrd-routing';
import { StepTargetedReviewPageComponent } from './pages/step-targeted-review-page/step-targeted-review-page.component';
import { TargetedConfirmationPageComponent } from './pages/targeted-confirmation-page/targeted-confirmation-page.component';
import { TechnicalIssuesErrorPageComponent } from './pages/technical-issues-error-page/technical-issues-error-page.component';
import { PurchaseOrganicStepShellPageComponentModule } from './pages/purchase-organic-step-shell-page/purchase-organic-step-shell-page.component';
import { StepOfferPresentmentPageComponent } from './pages/step-offer-presentment-page/step-offer-presentment-page.component';
import { StepOrganicCredentialsPageComponentModule } from './pages/step-organic-credentials-page/step-organic-credentials-page.component';
import { StepOrganicPaymentInterstitialPageComponentModule } from './pages/step-organic-payment-interstitial-page/step-organic-payment-interstitial-page.component';
import { StepOrganicReviewPageComponentModule } from './pages/step-organic-review-page/step-organic-review-page.component';
import { purchaseOrganicRouting } from './routing/purchase-organic-routing';
import { StepTargetedMrdPaymentWithQuotesPageComponent } from './pages/step-targeted-mrd-payment-with-quotes-page/step-targeted-mrd-payment-with-quotes-page.component';
import { StepOrganicPaymentWithQuotesPageComponent } from './pages/step-organic-payment-with-quotes-page/step-organic-payment-with-quotes-page.component';
import { DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule } from '@de-care/domains/subscriptions/ui-redeem-and-link-with-amazon';
import { purchaseTargeteRouting } from './routing/purchase-targeted-routing';
import { purchaseTargetedAddPlanRouting } from './routing/purchase-targeted-add-plan-routing';
import { TermUpsellFormComponentModule } from './page-parts/term-upsell-form/term-upsell-form.component';
import { SxmUiPackageCardBasicComponentModule, SxmUiFeaturesListComponentModule } from '@de-care/shared/sxm-ui/ui-primary-package-card';
import { SxmUiProductBannerComponentModule } from '@de-care/shared/sxm-ui/ui-product-banner';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { purchaseTargetedAddStreamingRouting } from './routing/purchase-targeted-add-streaming-routing';
import { StepPickAPlanMrdPageComponent } from './pages/step-pick-a-plan-mrd-page/step-pick-a-plan-mrd-page.component';
import { DomainsIdentificationUiValidateLpzFormModule } from '@de-care/domains/identification/ui-validate-lpz-form';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';
import { OrganicConfirmationPageComponent } from './pages/organic-confirmation-page/organic-confirmation-page.component';
import { OrganicConfirmationCanActivateService } from './pages/organic-confirmation-page/organic-confirmation-can-activate.service';
import { OrganicAddStreamingConfirmationCanActivateService } from './pages/organic-add-streaming-confirmaton-page/organic-add-streaming-confirmation-can-activate.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'ineligible-redirect', pathMatch: 'full', component: IneligibleErrorPageComponent, canActivate: [TempIncludeGlobalStyleScriptCanActivateService] },
            {
                path: 'technical-issues',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: TechnicalIssuesErrorPageComponent,
                        canActivate: [HidePageLoaderCanActivateService],
                    },
                ],
            },
            {
                path: 'you-already-have-a-subscription-error',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        canActivate: [HidePageLoaderCanActivateService],
                        loadComponent: () =>
                            import('./pages/you-already-have-a-subscription-error-page/you-already-have-a-subscription-error-page.component').then(
                                (c) => c.YouAlreadyHaveASubscriptionErrorPageComponent
                            ),
                    },
                ],
            },
            {
                path: 'generic-error',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: GenericErrorPageComponent,
                        data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                        canActivate: [HidePageLoaderCanActivateService],
                    },
                ],
            },
            {
                path: 'expired-offer-error',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: ExpiredOfferErrorPageComponent,
                        data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                        canActivate: [HidePageLoaderCanActivateService],
                    },
                ],
            },
            {
                path: 'promo-code-redeemed-error',
                pathMatch: 'full',
                component: PageShellBasicComponent,
                data: { pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: PromoCodeRedeemedErrorPageComponent,
                        data: { ctaURL: 'subscribe/checkout/purchase/streaming/organic' },
                        canActivate: [HidePageLoaderCanActivateService],
                    },
                ],
            },
            {
                path: '',
                children: [
                    {
                        path: 'targeted',
                        data: { useCaseKey: 'STREAMING_TARGETED' },
                        canActivate: [
                            TempIncludeGlobalStyleScriptCanActivateService,
                            DisableRoutingLoaderCanActivateService,
                            UpdateUsecaseCanActivateService,
                            LoadIpLocationAndSetProvinceCanActivateService,
                        ],
                        children: [
                            {
                                path: 'thanks',
                                pathMatch: 'full',
                                component: PageShellBasicComponent,
                                data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                                children: [
                                    {
                                        path: '',
                                        pathMatch: 'full',
                                        component: TargetedConfirmationPageComponent,
                                    },
                                ],
                            },
                            {
                                path: '',
                                children: [purchaseTargeteRouting],
                            },
                            {
                                path: 'add-plan',
                                children: [purchaseTargetedAddPlanRouting],
                            },
                            {
                                path: 'mrd',
                                children: [purchaseTargetedMrdRouting],
                            },
                            {
                                path: 'mrd/thanks',
                                pathMatch: 'full',
                                component: PageShellBasicComponent,
                                data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                                children: [
                                    {
                                        path: '',
                                        pathMatch: 'full',
                                        loadComponent: () =>
                                            import('./pages/tageted-add-streaming-confirmation-page/tageted-add-streaming-confirmation-page.component').then(
                                                (c) => c.TagetedAddStreamingConfirmationPageComponent
                                            ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'targeted/add-streaming',
                        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, TurnOffFullPageLoaderCanActivateService],
                        children: [
                            {
                                path: '',
                                children: [purchaseTargetedAddStreamingRouting],
                            },
                            {
                                path: 'thanks',
                                pathMatch: 'full',
                                component: PageShellBasicComponent,
                                data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                                children: [
                                    {
                                        path: '',
                                        pathMatch: 'full',
                                        loadComponent: () =>
                                            import('./pages/organic-add-streaming-confirmaton-page/organic-add-streaming-confirmaton-page.component').then(
                                                (c) => c.OrganicAddStreamingConfirmatonPageComponent
                                            ),
                                        canActivate: [OrganicAddStreamingConfirmationCanActivateService],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'organic/thanks',
                        pathMatch: 'full',
                        component: PageShellBasicComponent,
                        data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                        canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: OrganicConfirmationPageComponent,
                                canActivate: [OrganicConfirmationCanActivateService],
                            },
                        ],
                    },
                    {
                        path: 'organic',
                        data: { useCaseKey: 'STREAMING_ORGANIC' },
                        canActivate: [UpdateUsecaseCanActivateService, LoadIpLocationAndSetProvinceCanActivateService],
                        children: [
                            {
                                path: '',
                                canActivate: [DisableRoutingLoaderCanActivateService],
                                children: [purchaseOrganicRouting],
                            },
                            {
                                path: 'amex-int',
                                pathMatch: 'full',
                                redirectTo: '/subscribe/checkout/purchase/streaming/organic/amex?programCode=AMEXPSRTP6MOFREE',
                            },
                            {
                                path: 'amex/thanks',
                                pathMatch: 'full',
                                component: PageShellBasicComponent,
                                data: { pageShellBasic: { headerTheme: 'blue' } as PageShellBasicRouteConfiguration },
                                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                                children: [
                                    {
                                        path: '',
                                        pathMatch: 'full',
                                        component: OrganicConfirmationPageComponent,
                                        canActivate: [OrganicConfirmationCanActivateService],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'organic-min',
                        pathMatch: 'full',
                        redirectTo: 'organic/min',
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DeCareSharedUiPageShellBasicModule,
        PurchaseOrganicStepShellPageComponentModule,
        DeCareUseCasesCheckoutStateStreamingModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiAccordionStepperModule,
        SharedSxmUiUiPrimaryPackageCardModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        ErrorPagesModule,
        DeCareUseCasesCheckoutUiCommonModule,

        // TODO: need to look in to updating this module so it doesn't depend on the old SxmUi module
        DomainsPaymentUiPrepaidRedeemModule,

        // TODO: need to look in to updating this module so it doesn't depend on the old SxmUi module
        DomainsQuotesUiOrderSummaryModule,

        // TODO: need to refactor this since it is
        SharedSxmUiUiNucaptchaModule,

        SharedSxmUiUiAlertPillModule,
        DomainsAccountUiRegisterModule,
        SharedSxmUiUiHeroModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        ReactiveComponentModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiListenOnDevicesModule,
        SharedSxmUiUiLoadingOverlayModule,
        SharedSxmUiUiDealAddonCardModule,
        DomainsOffersUiOfferFormsModule,
        DomainsSubscriptionsUiRedeemAndLinkWithAmazonModule,
        TermUpsellFormComponentModule,
        SxmUiPackageCardBasicComponentModule,
        SxmUiProductBannerComponentModule,
        SxmUiFeaturesListComponentModule,
        SharedSxmUiUiAccordionChevronModule,
        DomainsIdentificationUiValidateLpzFormModule,
        SxmUiButtonCtaComponentModule,
        // For creds interstitial page
        SharedSxmUiUiIconStreamingModule,

        StepOrganicCredentialsPageComponentModule,
        StepOrganicPaymentInterstitialPageComponentModule,
        StepOrganicReviewPageComponentModule,
    ],
    declarations: [
        OrganicConfirmationPageComponent,
        StepPickAPlanMrdPageComponent,
        StepTargetedReviewPageComponent,
        TargetedConfirmationPageComponent,
        TechnicalIssuesErrorPageComponent,
        StepOfferPresentmentPageComponent,
        StepTargetedMrdPaymentWithQuotesPageComponent,
        StepOrganicPaymentWithQuotesPageComponent,
    ],
    providers: [CurrencyPipe],
})
export class DeCareUseCasesCheckoutFeatureStreamingModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
