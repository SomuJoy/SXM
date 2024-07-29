import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { CustomerInfoModule } from '@de-care/customer-info';
import { IdentificationModule } from '@de-care/identification';
import { OffersModule } from '@de-care/offers';
import { DomainsDeviceUiRefreshDeviceModule } from '@de-care/domains/device/ui-refresh-device';
import { DomainsAccountUiRegisterModule } from '@de-care/domains/account/ui-register';
import { SalesCommonModule } from '@de-care/sales-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DeCareUseCasesTrialActivationUiImportantInfoModule } from '@de-care/de-care-use-cases/trial-activation/ui-important-info';
import { LoginInfoComponent } from './common-ui/login-info/login-info.component';
import { PostActivationInstructionsComponent } from './common-ui/post-activation-instructions/post-activation-instructions.component';
import { TrialActivationOfferDetailsComponent } from './common-ui/trial-activation-offer-details/trial-activation-offer-details.component';
import { AccountFormStepComponent } from './page-parts/account-form-step/account-form-step.component';
import { IdentificationStepComponent } from './page-parts/identification-step/identification-step.component';
import { NewAccountFormStepComponent } from './page-parts/new-account-form-step/new-account-form-step.component';
import { ActivationFlowComponent } from './pages/activation-flow/activation-flow.component';
import { OneStepActivationFlowComponent } from './pages/one-step-activation-flow/one-step-activation-flow.component';
import { TrialActivationThankYouComponent } from './pages/trial-activation-thank-you/trial-activation-thank-you.component';
import { TrialExpiredOverlayComponent } from './pages/trial-expired-overlay/trial-expired-overlay.component';
import { TrialActivationService } from './processing/trial-activation.service';
import { ProgramCodeResolver } from './program-code.resolver';
import { ProspectResolver } from './prospect.resolver';
import { RadioUsedCarBrandingTypeResolver } from './radio-used-car-branding-type.resolver';
import { RadioResolver } from './radio.resolver';
import { TrialActivationThanksResolver } from './trial-activation-thanks.resolver';
import { TrialTokenResolver } from './trial-token.resolver';
import { VehicleInfoResolver } from './vehicle-info.resolver';
import { SweepstakesResolver } from './sweepstakes.resolver';
import { SweepstakesModule } from '@de-care/sweepstakes';
import { CustomerInfoPrefillResolver } from './customer-info-prefill.resolver';
import { ServiceLaneOneClickConfirmationComponent } from './pages/service-lane-one-click-confirmation/service-lane-one-click-confirmation.component';
import { SLOC_PAGE_THANKS_SEGMENT } from './service-lane-one-click-route-path.constants';
import { ServiceLaneOneClickResolver } from './service-lane-one-click.resolver';
import { DeCareUseCasesTrialActivationUiReadyToExploreModule } from '@de-care/de-care-use-cases/trial-activation/ui-ready-to-explore';
import { DomainsCustomerStateLocaleModule, setProvinceSelectionVisibleIfCanada } from '@de-care/domains/customer/state-locale';
import { Store } from '@ngrx/store';
import { OneStepNewAccountFormStepComponent } from './page-parts/one-step-new-account-form-step/one-step-new-account-form-step.component';
import { ReturnUrlResolver } from './return-url.resolver';
import { VehicleInfoTranslatePipe } from './vehicle-info-translate.pipe';
import { SharedSxmUiUiTranslationSplitterModule } from '@de-care/shared/sxm-ui/ui-translation-splitter';
import { OneStepActivationConfirmationComponent } from './pages/one-step-activation-confirmation/one-step-activation-confirmation.component';
import { DomainsOffersUiOfferDetailsWrapperModule } from '@de-care/domains/offers/ui-offer-details-wrapper';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { DomainsUtilityStateEnvironmentInfoModule } from '@de-care/domains/utility/state-environment-info';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';
import { DeCareUseCasesTrialActivationStateLegacyModule } from '@de-care/de-care-use-cases/trial-activation/state-legacy';
import { SharedSxmUiUiHeroModule } from '@de-care/shared/sxm-ui/ui-hero';
import { SharedSxmUiUiLegalCopyModule } from '@de-care/shared/sxm-ui/ui-legal-copy';
import { SharedSxmUiUiPageHeaderBasicModule } from '@de-care/shared/sxm-ui/ui-page-header-basic';
import { SharedSxmUiUiNucaptchaModule } from '@de-care/shared/sxm-ui/ui-nucaptcha';
import { DefaultErrorPageComponent } from './pages/default-error-page/default-error-page.component';
import { AlreadyHasSubscriptionErrorPageComponent } from './pages/already-has-subscription-error-page/already-has-subscription-error-page.component';
import { IsNotEligibleErrorPageComponent } from './pages/is-not-eligible-error-page/is-not-eligible-error-page.component';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DomainsAccountStateAccountModule } from '@de-care/domains/account/state-account';
import {
    LoadEnvironmentInfoCanActivateService,
    UpdateUsecaseCanActivateService,
    LoadPackageDescriptionsCanActivateService,
    TempIncludeGlobalStyleScriptCanActivateService,
} from '@de-care/de-care-use-cases/shared/ui-router-common';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';

const routes: Routes = [
    {
        path: '',
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPackageDescriptionsCanActivateService],
        children: [
            {
                path: '',
                canActivate: [LoadEnvironmentInfoCanActivateService],
                component: PageProcessingMessageComponent,
                resolve: { valid: ServiceLaneOneClickResolver },
            },
            {
                path: SLOC_PAGE_THANKS_SEGMENT,
                component: ServiceLaneOneClickConfirmationComponent,
                resolve: {
                    flowData: TrialActivationThanksResolver,
                },
            },
            {
                path: 'trial',
                canActivate: [LoadEnvironmentInfoCanActivateService],
                children: [
                    {
                        path: 'flepz',
                        component: ActivationFlowComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                        data: { useCaseKey: 'SATELLITE_TRIAL', keepCustomerInfo: true },
                        resolve: {
                            prospectInfo: ProspectResolver,
                            sweepstakesInfo: SweepstakesResolver,
                        },
                    },
                    {
                        path: '',
                        component: OneStepActivationFlowComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                        data: { useCaseKey: 'SATELLITE_TRIAL', keepCustomerInfo: true },
                        resolve: {
                            vehicleInfo: VehicleInfoResolver,
                            offerData: RadioUsedCarBrandingTypeResolver,
                            sweepstakesInfo: SweepstakesResolver,
                            customerInfo: CustomerInfoPrefillResolver,
                            returnUrl: ReturnUrlResolver,
                        },
                        pathMatch: 'full',
                    },
                    {
                        path: 'trial-expired-overlay',
                        component: TrialExpiredOverlayComponent,
                    },
                    {
                        path: 'thanks',
                        component: TrialActivationThankYouComponent,
                        resolve: {
                            flowData: TrialActivationThanksResolver,
                        },
                    },
                    {
                        path: 'one-step-thanks',
                        component: OneStepActivationConfirmationComponent,
                        resolve: {
                            flowData: TrialActivationThanksResolver,
                        },
                    },
                    {
                        path: 'cant-be-completed-online-error',
                        component: DefaultErrorPageComponent,
                    },
                    {
                        path: 'already-active-selfpay-error',
                        component: AlreadyHasSubscriptionErrorPageComponent,
                    },
                    {
                        path: 'not-eligible-error',
                        component: IsNotEligibleErrorPageComponent,
                    },
                ],
            },
            { path: '**', redirectTo: '/error' },
        ],
    },
];

const DECLARATIONS = [
    ActivationFlowComponent,
    OneStepActivationFlowComponent,
    IdentificationStepComponent,
    AccountFormStepComponent,
    NewAccountFormStepComponent,
    OneStepNewAccountFormStepComponent,
    LoginInfoComponent,
    TrialExpiredOverlayComponent,
    TrialActivationOfferDetailsComponent,
    PostActivationInstructionsComponent,
    TrialActivationThankYouComponent,
    OneStepActivationConfirmationComponent,
    ServiceLaneOneClickConfirmationComponent,
    VehicleInfoTranslatePipe,
    DefaultErrorPageComponent,
    AlreadyHasSubscriptionErrorPageComponent,
    IsNotEligibleErrorPageComponent,
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes),
        SxmUiModule,
        ReactiveFormsModule,
        IdentificationModule,
        OffersModule,
        CustomerInfoModule,
        SalesCommonModule,
        DomainsAccountUiRegisterModule,
        DomainsDeviceUiRefreshDeviceModule,
        SweepstakesModule,
        DeCareUseCasesTrialActivationUiReadyToExploreModule,
        DeCareUseCasesTrialActivationUiImportantInfoModule,
        DomainsCustomerStateLocaleModule,
        SharedSxmUiUiTranslationSplitterModule,
        DomainsOffersUiOfferDetailsWrapperModule,
        DomainsChatUiChatWithAgentLinkModule,
        DomainsUtilityStateEnvironmentInfoModule,
        SharedSxmUiUiLoadingIndicatorModule,
        DeCareUseCasesTrialActivationStateLegacyModule,
        SharedSxmUiUiHeroModule,
        SharedSxmUiUiLegalCopyModule,
        SharedSxmUiUiPageHeaderBasicModule,
        SharedSxmUiUiNucaptchaModule,
        SharedSxmUiUiDataClickTrackModule,
        DomainsAccountStateAccountModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
    providers: [
        TrialTokenResolver,
        ProgramCodeResolver,
        RadioResolver,
        ProspectResolver,
        RadioUsedCarBrandingTypeResolver,
        TrialActivationThanksResolver,
        VehicleInfoResolver,
        TrialActivationService,
        SweepstakesResolver,
        CustomerInfoPrefillResolver,
        ServiceLaneOneClickResolver,
    ],
})
export class TrialActivationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, store: Store) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/trial-activation.en-CA.json') },
            'en-US': { ...require('./i18n/trial-activation.en-US.json') },
            'fr-CA': { ...require('./i18n/trial-activation.fr-CA.json') },
        };

        store.dispatch(setProvinceSelectionVisibleIfCanada({ isVisible: false }));

        super(translateService, languages);
    }
}
