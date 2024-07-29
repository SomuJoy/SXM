import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PackageDescriptionTranslationsService } from '@de-care/app-common';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DeCareUseCasesTransferStateACSCTargetedModule } from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';
import { SharedSxmUiUiDotProgressBarStepperModule } from '@de-care/shared/sxm-ui/ui-dot-progress-bar-stepper';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiRadioOptionCardWithFlagFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-card-with-flag-form-field';
import { SharedSxmUiUiRadioOptionAsBlockFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-as-block-form-field';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AddRadioPageCanActivateService } from './add-radio-page-can-activate.service';
import { ChoosePaymentMethodComponent } from './page-parts/choose-payment-method/choose-payment-method.component';
import { ChooseSubscriptionComponent } from './page-parts/choose-subscription/choose-subscription.component';
import { ReviewOrderComponent } from './page-parts/review-order/review-order.component';
import { SelectTransferMethodComponent } from './page-parts/select-transfer-method/select-transfer-method.component';
import { AddRadioPageComponent } from './pages/add-radio-page/add-radio-page.component';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { SharedSxmUiUiVehicleWithSubscriptionInfoModule } from '@de-care/shared/sxm-ui/ui-vehicle-with-subscription-info';
import { SharedSxmUiUiRadioOptionCardWithAccordionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-card-with-accordion-form-field';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPackagesComparisonModule } from '@de-care/shared/sxm-ui/ui-packages-comparison';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import { SharedSxmUiUiWithoutPlatformNamePipeModule, WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { CustomerInfoModule } from '@de-care/customer-info'; // TODO: remove this import when we can use the billing info form from its own domain
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiWithoutVehicleMakeModule, WithoutVehicleMakePipe } from '@de-care/shared/sxm-ui/ui-without-vehicle-make';
import { FeatureToggleModule } from 'ngx-feature-toggle';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';
import { SharedSxmUiUiListenNowModule } from '@de-care/shared/sxm-ui/ui-listen-now';
import { SharedSxmUiUiReadyToExploreWrapperModule } from '@de-care/shared/sxm-ui/ui-ready-to-explore-wrapper';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';
import { ReviewOrderModule } from '@de-care/review-order';
import { DomainsOffersStateOffersModule } from '@de-care/domains/offers/state-offers';
import { GenericErrorPageComponent } from './pages/generic-error-page/generic-error-page.component';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { AlreadyConsolidatedWithFollowonComponent } from './pages/already-consolidated-with-followon/already-consolidated-with-followon.component';
import { AlreadyConsolidatedWithoutFollowonComponent } from './pages/already-consolidated-without-followon/already-consolidated-without-followon.component';
import { AlreadyConsolidatedResolverService } from './already-consolidated-resolver.service';
import { OffersModule } from '@de-care/offers'; //need this for lead-offer-details in error page, remove when enabling cms
import { SalesCommonModule } from '@de-care/sales-common'; //need this for offer-details in error page, remove when enabling cms
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { CanActivateConfirmationPage } from './can-activate-confirmation-page';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { ACSCProgramcodeResolverService } from './acsc-programcode-resolver.service';
import { RadioLookupPageComponent } from './pages/radio-lookup/radio-lookup-page.component';
import { RadioLookupPageCanActivateService } from './radio-lookup-page-can-activate.service';
import { SharedSxmUiUiRadioidFormFieldModule } from '@de-care/shared/sxm-ui/ui-radioid-form-field';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiInputFocusModule } from '@de-care/shared/sxm-ui/ui-input-focus';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DomainsAccountUiLoginModule } from '@de-care/domains/account/ui-login';
import { LoggedInRouterCanActivateService } from './logged-in-router-can-activate.service';
import { OacRedirectCanActivateService } from './oac-redirect-can-activate.service';
import { LoginPageCanActivateService } from './pages/login-page/login-page-can-activate.service';
import { DomainsOffersUiPromoCodeValidationFormModule } from '@de-care/domains/offers/ui-promo-code-validation-form';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SwapRadioLookupPageComponent } from './pages/swap-radio-lookup-page/swap-radio-lookup-page.component';
import { SwapRadioPageComponent } from './pages/swap-radio-page/swap-radio-page.component';
import { SwapRadioPageCanActivateService } from './pages/swap-radio-page/swap-radio-page-can-activate.service';
import { DomainsPaymentUiBillingInfoFormModule } from '@de-care/domains/payment/ui-billing-info-form';
import { SwapLookupPageCanActivateService } from './pages/swap-radio-lookup-page/swap-radio-lookup-page-can-activate.service';
import { SharedSxmUiUiQuoteModule } from '@de-care/shared/sxm-ui/ui-quote';
import { SharedSxmUiUiContentCardModule } from '@de-care/shared/sxm-ui/ui-content-card';
import { SxmUiPlatformChangeMessageComponent } from './ui-common/platform-change-message/platform-change-message.component';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { DomainsOffersUiGetDiffExcludedChannelsPipeModule } from '@de-care/domains/offers/ui-get-diff-excluded-channels-pipe';
import { AcPackageOptionCardComponent } from './ui-common/ac-package-option-card/ac-package-option-card.component';
import { ScPackageOptionCardComponent } from './ui-common/sc-package-option-card/sc-package-option-card.component';
import { RetainInvoiceBillingChargeAgreementComponent } from './ui-common/retain-invoice-billing-charge-agreement/retain-invoice-billing-charge-agreement.component';
import { SwapConfirmationPageComponent } from './pages/swap-confirmation-page/swap-confirmation-page.component';
import { SwapConfirmationPageCanActivateService } from './pages/swap-confirmation-page/swap-confirmation-page-can-activate.service';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { LoadEnvironmentInfoCanActivateService, TurnOnFullPageLoaderCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { SxmUiDetailBlocksComponent } from './ui-common/detail-blocks/detail-blocks.component';
import { PortRadioPageComponent } from './pages/port-radio-page/port-radio-page.component';
import { PortPaymentComponent } from './page-parts/port-payment/port-payment.component';
import { PortReviewComponent } from './page-parts/port-review/port-review.component';
import { PortConfirmationPageComponent } from './pages/port-confirmation-page/port-confirmation-page.component';
import { PortConfirmationPageCanActivateService } from './pages/port-confirmation-page/port-confirmation-page-can-activate.service';
import { SharedSxmUiUiListenerDetailsModule } from '@de-care/shared/sxm-ui/ui-listener-details';
import { PortRadioPageCanActivateService } from './pages/port-radio-page/port-radio-page-can-activate.service';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credit-card-form-fields';
import { DomainsQuotesUiCompactQuoteSummaryModule } from '@de-care/domains/quotes/ui-compact-quote-summary';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: AddRadioPageComponent,
                canActivate: [TurnOnFullPageLoaderCanActivateService, AddRadioPageCanActivateService],
                resolve: { ACSCProgramcodeResolverService },
            },
            {
                path: 'thanks',
                component: ConfirmationPageComponent,
                canActivate: [CanActivateConfirmationPage],
            },
            {
                path: 'consolidated-offer',
                component: AlreadyConsolidatedWithoutFollowonComponent,
                resolve: { programCode: AlreadyConsolidatedResolverService },
            },
            {
                path: 'consolidated',
                component: AlreadyConsolidatedWithFollowonComponent,
            },
            {
                path: 'error',
                component: GenericErrorPageComponent,
            },
            {
                path: 'lookup',
                component: RadioLookupPageComponent,
                canActivate: [RadioLookupPageCanActivateService],
            },
            {
                path: 'login',
                component: LoginPageComponent,
                canActivate: [LoginPageCanActivateService],
            },
            {
                path: 'login-router',
                canActivate: [LoggedInRouterCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: 'oac-redirect',
                canActivate: [OacRedirectCanActivateService],
                component: PageProcessingMessageComponent,
            },
            {
                path: 'swap',
                children: [
                    {
                        path: '',
                        component: SwapRadioLookupPageComponent,
                        canActivate: [TurnOnFullPageLoaderCanActivateService, LoadEnvironmentInfoCanActivateService, SwapLookupPageCanActivateService],
                    },
                    {
                        path: 'checkout',
                        component: SwapRadioPageComponent,
                        canActivate: [SwapRadioPageCanActivateService],
                    },
                    {
                        path: 'thanks',
                        component: SwapConfirmationPageComponent,
                        canActivate: [SwapConfirmationPageCanActivateService],
                    },
                ],
            },
            {
                path: 'port',
                children: [
                    {
                        path: '',
                        component: PortRadioPageComponent,
                        canActivate: [TurnOnFullPageLoaderCanActivateService, PortRadioPageCanActivateService],
                    },
                    {
                        path: 'thanks',
                        component: PortConfirmationPageComponent,
                        canActivate: [PortConfirmationPageCanActivateService],
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        DeCareUseCasesSharedUiPageMainModule,
        DeCareUseCasesTransferStateACSCTargetedModule,
        SharedSxmUiUiDotProgressBarStepperModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiRadioOptionAsBlockFormFieldModule,
        SharedSxmUiUiVehicleWithSubscriptionInfoModule,
        SharedSxmUiUiRadioOptionCardWithFlagFormFieldModule,
        SharedSxmUiUiRadioOptionCardWithAccordionFormFieldModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiPackagesComparisonModule,
        DomainsAccountStateAccountModule,
        DomainsOffersStateOffersModule,
        SharedSxmUiUiWithoutPlatformNamePipeModule,
        SharedSxmUiUiAccordionChevronModule,
        FormsModule,
        ReactiveFormsModule,
        CustomerInfoModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiWithoutVehicleMakeModule,
        FeatureToggleModule,
        DomainsQuotesUiOrderSummaryModule,
        SharedSxmUiUiListenNowModule,
        SharedSxmUiUiReadyToExploreWrapperModule,
        SharedSxmUiUiSafeHtmlModule,
        ReviewOrderModule,
        DomainsChatUiChatWithAgentLinkModule,
        OffersModule,
        SalesCommonModule,
        DomainsAccountUiRegisterModule,
        DomainsAccountStateSecurityQuestionsModule,
        SharedSxmUiUiRadioidFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiInputFocusModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsAccountUiLoginModule,
        DomainsOffersUiPromoCodeValidationFormModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        DomainsPaymentUiBillingInfoFormModule,
        SharedSxmUiUiQuoteModule,
        SharedSxmUiUiContentCardModule,
        SharedSxmUiUiTooltipModule,
        DomainsOffersUiGetDiffExcludedChannelsPipeModule,
        DomainsDeviceUiRefreshDeviceModule,
        SharedSxmUiUiListenerDetailsModule,
        SharedSxmUiUiCreditCardFormFieldsModule,
        DomainsQuotesUiCompactQuoteSummaryModule,
        ReactiveComponentModule,
    ],
    declarations: [
        AddRadioPageComponent,
        ConfirmationPageComponent,
        SelectTransferMethodComponent,
        ChoosePaymentMethodComponent,
        ReviewOrderComponent,
        ChooseSubscriptionComponent,
        GenericErrorPageComponent,
        AlreadyConsolidatedWithFollowonComponent,
        AlreadyConsolidatedWithoutFollowonComponent,
        RadioLookupPageComponent,
        LoginPageComponent,
        SwapRadioLookupPageComponent,
        SwapRadioPageComponent,
        SxmUiPlatformChangeMessageComponent,
        AcPackageOptionCardComponent,
        ScPackageOptionCardComponent,
        RetainInvoiceBillingChargeAgreementComponent,
        SwapConfirmationPageComponent,
        SxmUiDetailBlocksComponent,
        PortRadioPageComponent,
        PortPaymentComponent,
        PortReviewComponent,
        PortConfirmationPageComponent,
    ],
    providers: [WithoutVehicleMakePipe, WithoutPlatformNamePipe, CurrencyPipe],
})
export class DeCareUseCasesTransferFeatureACSCTargetedModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, packageDescriptionTranslationsService: PackageDescriptionTranslationsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
        packageDescriptionTranslationsService.loadTranslations(translateService);
    }
}
