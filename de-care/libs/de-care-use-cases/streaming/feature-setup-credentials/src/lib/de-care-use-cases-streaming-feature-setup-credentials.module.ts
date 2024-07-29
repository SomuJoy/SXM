import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PackageDescriptionTranslationsResolver } from '@de-care/app-common';
import { DomainsAccountUiSubscriptionStreamingModule } from '@de-care/domains/account/ui-subscription-streaming';
import { DomainsUtilityStateNativeAppIntegrationModule } from '@de-care/domains/utility/state-native-app-integration';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiSubscriptionSummaryBlockModule } from '@de-care/shared/sxm-ui/ui-subscription-summary-block';
import { MissingTranslationHandler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { RouterModule } from '@angular/router';
import { FindAccountPageComponent } from './pages/find-account-page/find-account-page.component';
import { DeCareUseCasesStreamingStateSetupCredentialsModule } from '@de-care/de-care-use-cases/streaming/state-setup-credentials';
import { FindAccountPageCanActivateService } from './pages/find-account-page/find-account-page-can-activate.service';
import { DeCareUseCasesSharedUiShellBasicModule, ShellBasicWithLangToggleComponent } from '@de-care/de-care-use-cases/shared/ui-shell-basic';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DomainsIdentityUiStreamingFlepzLookupFormModule } from '@de-care/domains/identity/ui-streaming-flepz-lookup-form';
import { DomainsIdentityUiDeviceLookupModule } from '@de-care/domains/identity/ui-device-lookup';
import { AccountNotFoundPageComponent } from './pages/account-not-found-page/account-not-found-page.component';
import { RadioIdPageComponent } from './pages/radio-id-page/radio-id-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { InactiveSubscriptionPageComponent } from './pages/inactive-subscription-page/inactive-subscription-page.component';
import { CredentialSetupPageComponent } from './pages/credential-setup-page/credential-setup-page.component';
import { ExistingCredentialsPageComponent } from './pages/existing-credentials-page/existing-credentials-page.component';
import { MultipleSubscriptionsPageComponent } from './pages/multiple-subscriptions-page/multiple-subscriptions-page.component';
import { CompletePageLoadingOverlayCanActivateService } from './complete-page-loading-overlay-can-activate.service';
import { CredentialSetupConfirmationPageComponent } from './pages/credential-setup-confirmation-page/credential-setup-confirmation-page.component';
import { ProcessInboundUrlResolver } from './route-guards/process-inbound-url-resolver';
import { LookupByFlepzDataCanActivateService } from './route-guards/lookup-by-flepz-data-can-activate.service';
import { TokenLookupByFlepzDataCanActivateService } from './route-guards/token-lookup-by-flepz-data-can-activate.service';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { DomainsAccountUiSecurityQuestionsFormFieldsModule } from '@de-care/domains/account/ui-security-questions-form-fields';
import { DomainsAccountUiRegisterMultiStepModule } from '@de-care/domains/account/ui-register-multi-step';
import { RegistrationGuard } from './route-guards/registration-guard';
import { IneligibleAudioWithNoStreamingCapabilityComponent } from './pages/ineligible-audio-with-no-streaming-capability/ineligible-audio-with-no-streaming-capability.component';
import { IneligibleExpiredAaTrialComponent } from './pages/ineligible-expired-aa-trial/ineligible-expired-aa-trial.component';
import { IneligibleInsufficientPackageComponent } from './pages/ineligible-insufficient-package/ineligible-insufficient-package.component';
import { IneligibleMaxLifetimeTrialsComponent } from './pages/ineligible-max-lifetime-trials/ineligible-max-lifetime-trials.component';
import { IneligibleNoAudioComponent } from './pages/ineligible-no-audio/ineligible-no-audio.component';
import { IneligibleNonConsumerComponent } from './pages/ineligible-non-consumer/ineligible-non-consumer.component';
import { IneligibleNonPayPageComponent } from './pages/ineligible-non-pay-page/ineligible-non-pay-page.component';
import { IneligibleTrialWithinLastTrailDateComponent } from './pages/ineligible-trial-within-last-trail-date/ineligible-trial-within-last-trail-date.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { TransactionSessionFlepzSubmittedDataExistsGuard } from './route-guards/transaction-session-flepz-submitted-data-exists-guard.service';
import { Store } from '@ngrx/store';
import { behaviorEventReactionFeatureTransactionStarted } from '@de-care/shared/state-behavior-events';
import { SelectedSubscriptionSessionDataExistsCanActivateService } from './route-guards/selected-subscription-session-data-exists-can-activate.service';
import { MissingTranslationCustomHandler } from './missing-translation-custom-handler';
import { FreeListenSetupPageComponent } from './pages/free-listen-setup-page/free-listen-setup-page.component';
import { FreeListenSetupCanActivateService } from './pages/free-listen-setup-page/free-listen-setup-can-activate.service';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { ReactiveComponentModule } from '@ngrx/component';
import { CreatePasswordPageComponent } from './pages/create-password-page/create-password-page.component';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { CreatePasswordConfirmationPageComponent } from './pages/create-password-confirmation-page/create-password-confirmation-page.component';
import { FreeListenConfirmationPageComponent } from './pages/free-listen-confirmation-page/free-listen-confirmation-page.component';
import { ActivateDevicePageComponent } from './pages/activate-device-page/activate-device-page.component';
import { ActivatedDeviceCompletedPageComponent } from './pages/activate-device-completed-page/activated-device-completed-page.component';
import { ActivateDevicePageCanActivateService } from './pages/activate-device-page/activate-device-page-can-activate.service';
import { SharedSxmUiUiUsernameFormFieldModule } from '@de-care/shared/sxm-ui/ui-username-form-field';
import { DomainsUtilityStateEnvironmentInfoModule, CanActivateLoadEnvironmentInfo } from '@de-care/domains/utility/state-environment-info';
import { CreatePasswordConfirmationCanActivateService } from './pages/create-password-confirmation-page/create-password-confirmation-can-activate.service';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { InstantStreamCanActivateService } from './route-guards/instant-stream-can-activate.service';
import { TempIncludeGlobalStyleScriptCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ActivateDeviceMinPageComponent } from './pages/activate-device-min-page/activate-device-min-page.component';
import { ActivateDeviceMinPageCanActivateService } from './pages/activate-device-min-page/activate-device-min-page-can-activate.service';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { RadioIdLookupPageComponent } from './pages/radio-id-lookup-page/radio-id-lookup-page.component';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { IpToLocationCanActivateService } from './route-guards/ip-to-location-can-activate.service';
import { FlepzToTokenLookupCanActivateService } from './route-guards/flepz-to-token-lookup-can-activate.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            // TODO: remove this once microservice is updated to fix issue with streaming flepz returning packageName as null in some cases
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationCustomHandler },
        }),
        RouterModule.forChild([
            { path: 'instant-stream', pathMatch: 'full', component: PageProcessingMessageComponent, canActivate: [InstantStreamCanActivateService] },
            {
                path: 'activate-device',
                component: ShellBasicWithLangToggleComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CanActivateLoadEnvironmentInfo],
                data: { shellBasicWithLangToggle: { darkMode: true } },
                children: [
                    {
                        path: 'activated',
                        component: ActivatedDeviceCompletedPageComponent,
                        canActivate: [CompletePageLoadingOverlayCanActivateService],
                    },
                    {
                        path: '',
                        component: ActivateDevicePageComponent,
                        canActivate: [ActivateDevicePageCanActivateService],
                    },
                ],
            },
            {
                path: 'activate-device-min',
                component: ShellBasicWithLangToggleComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CanActivateLoadEnvironmentInfo],
                data: { shellBasicWithLangToggle: { darkMode: true } },
                children: [
                    {
                        path: '',
                        component: ActivateDeviceMinPageComponent,
                        canActivate: [ActivateDeviceMinPageCanActivateService],
                    },
                ],
            },
            {
                path: 'activate-device-for-location',
                component: PageProcessingMessageComponent,
                canActivate: [IpToLocationCanActivateService],
            },
            {
                path: 'sign-in/sonos',
                component: ShellBasicWithLangToggleComponent,
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CanActivateLoadEnvironmentInfo],
                data: { shellBasicWithLangToggle: { darkMode: true } },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SignInPageComponent,
                    },
                    {
                        path: 'activated',
                        component: ActivatedDeviceCompletedPageComponent,
                        canActivate: [CompletePageLoadingOverlayCanActivateService],
                    },
                ],
            },
            {
                path: 'free-listen',
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CanActivateLoadEnvironmentInfo, FreeListenSetupCanActivateService],
                children: [
                    {
                        path: '',
                        component: ShellBasicWithLangToggleComponent,
                        data: { shellBasicWithLangToggle: { darkMode: true } },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                component: FreeListenSetupPageComponent,
                            },
                            {
                                path: 'free-listen-confirmation',
                                component: FreeListenConfirmationPageComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                        ],
                    },
                ],
            },
            {
                path: 'create-password',
                component: ShellBasicWithLangToggleComponent,
                data: { shellBasicWithLangToggle: { darkMode: true } },
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService],
                children: [
                    {
                        path: 'completed',
                        component: CreatePasswordConfirmationPageComponent,
                        canActivate: [CreatePasswordConfirmationCanActivateService],
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: CreatePasswordPageComponent,
                        canActivate: [CompletePageLoadingOverlayCanActivateService],
                    },
                ],
            },
            {
                path: 'setup-credentials',
                canActivate: [TempIncludeGlobalStyleScriptCanActivateService, CanActivateLoadEnvironmentInfo],
                children: [
                    {
                        // Note: used to handle inbound redirect from external flepz form data collection,
                        //       this route is designed to read that data and do the flepz lookup then redirect to the appropriate route
                        //       based on flepz results the same way the find account page behaves
                        path: 'lookup',
                        canActivate: [LookupByFlepzDataCanActivateService],
                        component: PageProcessingMessageComponent,
                    },
                    {
                        path: 'tkn-lookup',
                        canActivate: [TokenLookupByFlepzDataCanActivateService],
                        component: PageProcessingMessageComponent,
                    },
                    {
                        path: '',
                        component: ShellBasicWithLangToggleComponent,
                        resolve: { _: ProcessInboundUrlResolver, allPackageDescriptions: PackageDescriptionTranslationsResolver },
                        data: { shellBasicWithLangToggle: { darkMode: true } },
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                canActivate: [FindAccountPageCanActivateService, FlepzToTokenLookupCanActivateService],
                                component: FindAccountPageComponent,
                            },
                            {
                                path: 'no-match',
                                component: AccountNotFoundPageComponent,
                                canActivate: [TransactionSessionFlepzSubmittedDataExistsGuard, CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'radio-id-lookup',
                                component: RadioIdLookupPageComponent,
                                canActivate: [TransactionSessionFlepzSubmittedDataExistsGuard, CompletePageLoadingOverlayCanActivateService],
                            },
                            { path: 'lookup-radio', component: RadioIdPageComponent, canActivate: [CompletePageLoadingOverlayCanActivateService] },
                            {
                                path: 'credential-setup',
                                component: CredentialSetupPageComponent,
                                canActivate: [SelectedSubscriptionSessionDataExistsCanActivateService, CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'multiple-subscriptions-page',
                                component: MultipleSubscriptionsPageComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            { path: 'existing-credentials', component: ExistingCredentialsPageComponent, canActivate: [CompletePageLoadingOverlayCanActivateService] },
                            { path: 'inactive-subscription', component: InactiveSubscriptionPageComponent, canActivate: [CompletePageLoadingOverlayCanActivateService] },
                            {
                                path: 'setup-login-confirmation',
                                component: CredentialSetupConfirmationPageComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'registration',
                                pathMatch: 'full',
                                component: RegistrationPageComponent,
                                canActivate: [RegistrationGuard],
                            },
                            {
                                path: 'ineligible-non-pay',
                                pathMatch: 'full',
                                component: IneligibleNonPayPageComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-non-consumer',
                                pathMatch: 'full',
                                component: IneligibleNonConsumerComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-insufficient-package',
                                pathMatch: 'full',
                                component: IneligibleInsufficientPackageComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-expired-AA-trial',
                                pathMatch: 'full',
                                component: IneligibleExpiredAaTrialComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-max-lifetime-trials',
                                pathMatch: 'full',
                                component: IneligibleMaxLifetimeTrialsComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-trial-within-last-trial-date',
                                pathMatch: 'full',
                                component: IneligibleTrialWithinLastTrailDateComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-no-audio',
                                pathMatch: 'full',
                                component: IneligibleNoAudioComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                            {
                                path: 'ineligible-audio-with-no-streaming-capability',
                                pathMatch: 'full',
                                component: IneligibleAudioWithNoStreamingCapabilityComponent,
                                canActivate: [CompletePageLoadingOverlayCanActivateService],
                            },
                        ],
                    },
                ],
            },
        ]),
        ReactiveFormsModule,
        DomainsUtilityStateEnvironmentInfoModule,
        DeCareUseCasesSharedUiShellBasicModule,
        DeCareUseCasesStreamingStateSetupCredentialsModule,
        DeCareUseCasesSharedUiPageMainModule,
        DomainsIdentityUiStreamingFlepzLookupFormModule,
        DomainsAccountUiSubscriptionStreamingModule,
        SharedSxmUiUiSubscriptionSummaryBlockModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiUsernameFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiAddressFormFieldsModule,
        DomainsAccountUiSecurityQuestionsFormFieldsModule,
        DomainsAccountUiRegisterMultiStepModule,
        SharedSxmUiUiModalModule,
        DomainsIdentityUiDeviceLookupModule,
        DomainsUtilityStateNativeAppIntegrationModule,
        ReactiveComponentModule,
        SharedValidationFormControlInvalidModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsChatUiChatWithAgentLinkModule,
    ],
    declarations: [
        ActivateDevicePageComponent,
        ActivatedDeviceCompletedPageComponent,
        FindAccountPageComponent,
        AccountNotFoundPageComponent,
        RadioIdPageComponent,
        RegistrationPageComponent,
        InactiveSubscriptionPageComponent,
        CredentialSetupPageComponent,
        ExistingCredentialsPageComponent,
        MultipleSubscriptionsPageComponent,
        CredentialSetupConfirmationPageComponent,
        IneligibleAudioWithNoStreamingCapabilityComponent,
        IneligibleExpiredAaTrialComponent,
        IneligibleInsufficientPackageComponent,
        IneligibleMaxLifetimeTrialsComponent,
        IneligibleNoAudioComponent,
        IneligibleNonConsumerComponent,
        IneligibleNonPayPageComponent,
        IneligibleTrialWithinLastTrailDateComponent,
        FreeListenSetupPageComponent,
        CreatePasswordPageComponent,
        CreatePasswordConfirmationPageComponent,
        FreeListenConfirmationPageComponent,
        ActivateDeviceMinPageComponent,
        SignInPageComponent,
        RadioIdLookupPageComponent,
    ],
    providers: [ProcessInboundUrlResolver, RegistrationGuard],
})
export class DeCareUseCasesStreamingFeatureSetupCredentialsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, store: Store) {
        store.dispatch(behaviorEventReactionFeatureTransactionStarted({ flowName: 'onboardingweb' }));

        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
