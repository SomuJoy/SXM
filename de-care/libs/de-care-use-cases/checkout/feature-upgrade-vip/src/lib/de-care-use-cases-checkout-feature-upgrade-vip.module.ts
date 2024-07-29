import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeCareUseCasesCheckoutStateUpgradeVipModule } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DeCareUseCasesSharedUiShellBasicModule } from '@de-care/de-care-use-cases/shared/ui-shell-basic';
import { SharedSxmUiUiAccordionStepperModule } from '@de-care/shared/sxm-ui/ui-accordion-stepper';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationPageCanActivateService } from './pages/confirmation-page/confirmation-page-can-activate.service';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { PurchasePageCanActivateService } from './pages/purchase-page/purchase-page-can-activate.service';
import { PurchasePageComponent } from './pages/purchase-page/purchase-page.component';
import { UpgradingDevicesPageCanActivateService } from './pages/upgrading-devices-page/upgrading-devices-page-can-activate.service';
import { UpgradingDevicesPageComponent } from './pages/upgrading-devices-page/upgrading-devices-page.component';
import { DomainsOffersUiHeroModule } from '@de-care/domains/offers/ui-hero';
import { OffersModule } from '@de-care/offers';
import { SalesCommonModule } from '@de-care/sales-common';

import { DomainsVehicleUiVehicleInfoModule, VehicleInfoTranslatePipe } from '@de-care/domains/vehicle/ui-vehicle-info';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirstStepFormComponent } from './page-parts/first-step-form/first-step-form.component';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { DomainsPaymentUiBillingInfoFormModule } from '@de-care/domains/payment/ui-billing-info-form';
import { SharedSxmUiUiTaskProcessingReportModule } from '@de-care/shared/sxm-ui/ui-task-processing-report';
import { DomainsQuotesUiOrderSummaryModule } from '@de-care/domains/quotes/ui-order-summary';

import { DomainsIdentificationUiSetupRegistrationCredentialsFormModule } from '@de-care/domains/identification/ui-setup-registration-credentials-form';
import { DomainsIdentificationUiSetupLoginCredentialsFormModule } from '@de-care/domains/identification/ui-setup-login-credentials-form';

import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { IdentificationModule } from '@de-care/identification';
import { ReviewOrderModule } from '@de-care/review-order';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { ErrorComponent } from './page-parts/error/error.component';
import { ErrorPageComponent } from './pages/error-page/error-page-component';
import { DynamicFormForRadiosComponent } from './page-parts/dynamic-form-for-radios/dynamic-form-for-radios.component';
import { ReviewStepHeaderComponent } from './page-parts/review-step-header/review-step-header.component';
import { VipLayoutComponent } from './page-parts/vip-layout/vip-layout.component';

import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { ListenToRadioComponent } from './page-parts/listen-to-radio/listen-to-radio.component';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { SharedSxmUiUiStreamingPlayerLinkModule } from '@de-care/shared/sxm-ui/ui-streaming-player-link';
import { OrganicPageComponent } from './pages/organic-page/organic-page.component';
import { OrganicPageCanActivateService } from './pages/organic-page/organic-page-can-activate.service';
import { AccountLookupStepComponent } from './page-parts/account-lookup-step/account-lookup-step.component';
import { DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule } from '@de-care/domains/identification/ui-radio-id-and-account-number-lookup-form';
import { DomainsIdentificationUiValidateLpzFormModule } from '@de-care/domains/identification/ui-validate-lpz-form';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { RedirectFallbackPageComponent } from './pages/redirect-fallback-page/redirect-fallback-page-component';
import { RedirectFallbackPageCanActivateService } from './pages/redirect-fallback-page/redirect-fallback-page-can-activate.service';
import { SharedSxmUiUiLoadingWithAlertMessageModule } from '@de-care/shared/sxm-ui/ui-loading-with-alert-message';
import { SharedSxmUiUiTabsModule } from '@de-care/shared/sxm-ui/ui-tabs';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { DomainsUtilityStateIpLocationModule } from '@de-care/domains/utility/state-ip-location';
import { SharedSxmUiUiAppFooterModule } from '@de-care/shared/sxm-ui/ui-app-footer';
import { DomainsIdentificationUiRadioIdAndLastnameLookupFormModule } from '@de-care/domains/identification/ui-radio-id-and-lastname-lookup-form';
import { DeCareUseCasesSharedUiHeaderBarModule } from '@de-care/de-care-use-cases/shared/ui-header-bar';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { AddSecondRadioPageCanActivateService } from './pages/add-second-radio-page/add-second-radio-page-can-activate.service';
import { AddSecondRadioPageComponent } from './pages/add-second-radio-page/add-second-radio-page.component';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { DeCareSharedUiPageShellBasicModule, PageShellBasicComponent, PageShellBasicRouteConfiguration } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SecondRadioLookupComponent } from './components/second-radio-lookup/second-radio-lookup.component';
import { ReactiveComponentModule } from '@ngrx/component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiQuoteModule } from '@de-care/shared/sxm-ui/ui-quote';
import { AddSecondRadioConfirmationPageComponent } from './pages/add-second-radio-confirmation-page/add-second-radio-confimation-page.component';
import { DeCareUseCasesCheckoutUiCommonModule } from '@de-care/de-care-use-cases/checkout/ui-common';
import { AddSecondRadioOrderSummaryComponent } from './components/add-second-radio-order-summary/add-second-radio-order-summary.component';
import { AddSecondRadioConfirmationPageCanActivateService } from './pages/add-second-radio-confirmation-page/add-second-radio-confirmation-page-can-activate.service';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import {
    LoadCardBinRangesAsyncCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPackageDescriptionsCanActivateService],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: PurchasePageComponent,
                        canActivate: [LoadCardBinRangesAsyncCanActivateService, PurchasePageCanActivateService],
                        data: { animation: 'PurchasePage' },
                    },
                    {
                        path: 'flepz',
                        pathMatch: 'full',
                        component: OrganicPageComponent,
                        canActivate: [LoadCardBinRangesAsyncCanActivateService, OrganicPageCanActivateService],
                        data: { animation: 'PurchasePage' },
                    },
                    {
                        path: 'add-second-radio',
                        component: PageShellBasicComponent,
                        data: { animation: 'PurchasePage', pageShellBasic: { headerTheme: 'gray' } as PageShellBasicRouteConfiguration },
                        children: [
                            {
                                path: '',
                                canActivate: [LoadCardBinRangesAsyncCanActivateService, AddSecondRadioPageCanActivateService],
                                component: AddSecondRadioPageComponent,
                            },
                            {
                                path: 'thanks',
                                canActivate: [AddSecondRadioConfirmationPageCanActivateService],
                                component: AddSecondRadioConfirmationPageComponent,
                            },
                        ],
                    },
                    {
                        path: 'upgrading-devices',
                        component: UpgradingDevicesPageComponent,
                        canActivate: [UpgradingDevicesPageCanActivateService],
                        data: { animation: 'UpgradingDevices' },
                    },
                    {
                        path: 'thanks',
                        component: ConfirmationPageComponent,
                        canActivate: [ConfirmationPageCanActivateService],
                        data: { animation: 'ConfirmationPage' },
                    },
                    {
                        path: 'error',
                        component: ErrorPageComponent,
                    },
                    {
                        path: 'fallback',
                        component: RedirectFallbackPageComponent,
                        canActivate: [RedirectFallbackPageCanActivateService],
                    },
                ],
            },
        ]),
        TranslateModule.forChild(),
        FormsModule,
        DeCareUseCasesCheckoutStateUpgradeVipModule,
        DeCareUseCasesSharedUiShellBasicModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiAccordionStepperModule,
        DomainsOffersUiHeroModule,
        OffersModule,
        SalesCommonModule,
        DomainsVehicleUiVehicleInfoModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        ReactiveFormsModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiModalModule,
        DomainsPaymentUiBillingInfoFormModule,
        SharedSxmUiUiTaskProcessingReportModule,
        DomainsQuotesUiOrderSummaryModule,
        IdentificationModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiProceedButtonModule,
        ReviewOrderModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiHeroModule,
        DomainsDeviceUiRefreshDeviceModule,
        DomainsIdentificationUiSetupRegistrationCredentialsFormModule,
        DomainsIdentificationUiSetupLoginCredentialsFormModule,
        SharedSxmUiUiLegalCopyModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiStreamingPlayerLinkModule,
        DomainsIdentificationUiRadioIdAndAccountNumberLookupFormModule,
        DomainsIdentificationUiValidateLpzFormModule,
        SharedSxmUiUiHelpFindingRadioModule,
        SharedSxmUiUiLoadingWithAlertMessageModule,
        SharedSxmUiUiTabsModule,
        SharedSxmUiUiPrivacyPolicyModule,
        DomainsUtilityStateIpLocationModule,
        SharedSxmUiUiAppFooterModule,
        DomainsIdentificationUiRadioIdAndLastnameLookupFormModule,
        DeCareUseCasesSharedUiHeaderBarModule,
        SharedSxmUiUiTooltipModule,
        DeCareSharedUiPageLayoutModule,
        SharedSxmUiUiStepperModule,
        DeCareSharedUiPageShellBasicModule,
        ReactiveComponentModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiQuoteModule,
        DeCareUseCasesCheckoutUiCommonModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiPasswordFormFieldModule,
    ],
    declarations: [
        PurchasePageComponent,
        UpgradingDevicesPageComponent,
        ConfirmationPageComponent,
        FirstStepFormComponent,
        ReviewStepHeaderComponent,
        ErrorComponent,
        ErrorPageComponent,
        DynamicFormForRadiosComponent,
        ListenToRadioComponent,
        VipLayoutComponent,
        OrganicPageComponent,
        AccountLookupStepComponent,
        RedirectFallbackPageComponent,
        AddSecondRadioPageComponent,
        SecondRadioLookupComponent,
        AddSecondRadioConfirmationPageComponent,
        AddSecondRadioOrderSummaryComponent,
    ],
    providers: [
        PurchasePageCanActivateService,
        UpgradingDevicesPageCanActivateService,
        ConfirmationPageCanActivateService,
        VehicleInfoTranslatePipe,
        OrganicPageCanActivateService,
        RedirectFallbackPageCanActivateService,
        AddSecondRadioPageCanActivateService,
        AddSecondRadioConfirmationPageCanActivateService,
    ],
})
export class DeCareUseCasesCheckoutFeatureUpgradeVipModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
