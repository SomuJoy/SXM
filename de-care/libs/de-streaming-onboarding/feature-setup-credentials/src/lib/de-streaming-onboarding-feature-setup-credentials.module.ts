import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// TODO: Update this when PackageDescriptionTranslationsService is refactored out of @de-care/app-common
import { DeStreamingOnboardingStateSetupCredentialsModule } from '@de-care/de-streaming-onboarding/state-setup-credentials';
import { DomainsAccountUiSecurityQuestionsFormFieldsModule } from '@de-care/domains/account/ui-security-questions-form-fields';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { SharedSxmUiUiAddressFormFieldsModule } from '@de-care/shared/sxm-ui/ui-address-form-fields';
import { SharedSxmUiUiFlepzFormFieldsModule } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { MissingTranslationHandler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountNotFoundPageComponent } from './pages/account-not-found-page/account-not-found-page.component';
import { FindAccountPageComponent } from './pages/find-account-page/find-account-page.component';
import { IneligibleNonPayPageComponent } from './pages/ineligible-non-pay-page/ineligible-non-pay-page.component';
import { IneligibleNonConsumerComponent } from './pages/ineligible-non-consumer/ineligible-non-consumer.component';
import { IneligibleInsufficientPackageComponent } from './pages/ineligible-insufficient-package/ineligible-insufficient-package.component';
import { IneligibleExpiredAATrialComponent } from './pages/ineligible-expired-aa-trial/ineligible-expired-aa-trial.component';
import { IneligibleMaxLifetimeTrialsComponent } from './pages/ineligible-max-lifetime-trials/ineligible-max-lifetime-trials.component';
import { IneligibleTrailWithinLastTrailDateComponent } from './pages/ineligible-trail-within-last-trail-date/ineligible-trail-within-last-trail-date.component';
import { IneligibleNoAudioComponent } from './pages/ineligible-no-audio/ineligible-no-audio.component';
import { IneligibleAudioWithNoStreamingCapabilityComponent } from './pages/ineligible-audio-with-no-streaming-capability/ineligible-audio-with-no-streaming-capability.component';
import { CredentialSetupComponent } from './pages/credential-setup/credential-setup.component';
import { SharedSxmUiUiGlobalPersonalInfoModule } from '@de-care/shared/sxm-ui/ui-global-personal-info';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SingleMatchSetupLoginConfirmationPageComponent } from './pages/single-match-setup-login-confirmation-page/single-match-setup-login-confirmation-page.component';
import { RadioIdPageComponent } from './pages/radio-id-page/radio-id-page.component';
import { SharedSxmUiUiTextInputWithTooltipFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-input-with-tooltip-form-field';
import { MultipleSubscriptionsPageComponent } from './pages/multiple-subscriptions-page/multiple-subscriptions-page.component';
import { SharedSxmUiUiVerifyYourAccountFormFieldsModule } from '@de-care/shared/sxm-ui/ui-verify-your-account-form-fields';
import { RegistrationGuard } from './route-guards/registration-guard';
import { ProcessInboundUrlResolver } from './route-guards/process-inbound-url-resolver';
import { TransactionSessionFlepzSubmittedDataExistsGuard } from './route-guards/transaction-session-flepz-submitted-data-exists-guard.service';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SingleMatchOACPageComponent } from './pages/single-match-oac-page/single-match-oac-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { ClosedSubscriptionComponent } from './pages/closed-subscription/closed-subscription.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SharedSxmUiUiSubscriptionSummaryBlockModule } from '@de-care/shared/sxm-ui/ui-subscription-summary-block';
import { DomainsAccountUiSubscriptionStreamingModule } from '@de-care/domains/account/ui-subscription-streaming';
import { DomainsAccountUiRegisterMultiStepModule } from '@de-care/domains/account/ui-register-multi-step';
import { MissingTranslationCustomHandler } from './missing-translation-custom-handler';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { ForgotPasswordLandingPageComponent } from './pages/forgot-password-landing-page/forgot-password-landing-page.component';
import { SharedSxmUiUiUpdatePasswordFormFieldsModule } from '@de-care/shared/sxm-ui/ui-update-password-form-fields';
import { CredentialRecoveryComponent } from './pages/credential-recovery/credential-recovery.component';
import { SharedSxmUiUiCredentialRecoveryFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credential-recovery-form-fields';
import { ForgotPasswordMultipleAccountPageComponent } from './pages/forgot-password-multiple-account-page/forgot-password-multiple-account-page.component';
import { SharedSxmUiUiAccountSummaryBlockModule } from '@de-care/shared/sxm-ui/ui-account-summary-block';
import { VerifyYourAccountComponent } from './pages/verify-your-account/verify-your-account.component';
import { ResetPasswordLinkConfirmationPageComponent } from './pages/reset-password-link-confirmation-page/reset-password-link-confirmation-page.component';
import { UpdatePasswordConfirmationPageComponent } from './pages/update-password-confirmation-page/update-password-confirmation-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { AccountNotFoundComponent } from './pages/account-not-found/account-not-found.component';
import { DomainsIdentityUiDeviceLookupModule } from '@de-care/domains/identity/ui-device-lookup';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { ResetPasswordCanActivateService } from './pages/reset-password-page/reset-password-can-activate.service';
import { ResetPasswordTextConfirmationPageComponent } from './pages/reset-password-text-confirmation-page/reset-password-text-confirmation-page.component';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { ForgotUsernameEmailSentConfirmationPageComponent } from './pages/forgot-username-email-sent-confirmation-page/forgot-username-email-sent-confirmation-page.component';
import { ForgotUsernameSameEmailConfirmationPageComponent } from './pages/forgot-username-same-email-confirmation-page/forgot-username-same-email-confirmation-page.component';
import { ForgotUsernameLandingPageComponent } from './pages/forgot-username-landing-page/forgot-username-landing-page.component';
import { LoadPackageDescriptionsCanActivateService } from './route-guards/load-package-descriptions-can-activate.service';
import { MultipleAccountPageUsernameComponent } from './pages/multiple-account-page-username/multiple-account-page-username.component';
import { SharedSxmUiUiAccountSummaryBlockUsernameModule } from '@de-care/shared/sxm-ui/ui-account-summary-block-username';
import { DomainsOffersStatePackageDescriptionsModule } from '@de-care/domains/offers/state-package-descriptions';
import { ForgotPasswordTransactionStateGuard } from './route-guards/forgot-password-transaction-state-guard';
import { RecoverUsernameTransactionStateGuard } from './route-guards/recover-username-transaction-state-guard';
import { UpdateUsecaseCanActivateService } from './route-guards/update-usecase-can-activate.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            // TODO: remove this once microservice is updated to fix issue with streaming flepz returning packageName as null in some cases
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationCustomHandler },
        }),
        DomainsOffersStatePackageDescriptionsModule,
        RouterModule.forChild([
            {
                path: '',
                canActivate: [LoadPackageDescriptionsCanActivateService],
                resolve: { _: ProcessInboundUrlResolver },
                children: [
                    { path: 'find-account', pathMatch: 'full', component: FindAccountPageComponent },
                    // { path: 'no-match', pathMatch: 'full', component: AccountNotFoundPageComponent },
                    { path: 'ineligible-non-pay', pathMatch: 'full', component: IneligibleNonPayPageComponent },
                    { path: 'ineligible-non-consumer', pathMatch: 'full', component: IneligibleNonConsumerComponent },
                    { path: 'ineligible-insufficient-package', pathMatch: 'full', component: IneligibleInsufficientPackageComponent },
                    { path: 'ineligible-expired-AA-trial', pathMatch: 'full', component: IneligibleExpiredAATrialComponent },
                    { path: 'ineligible-max-lifetime-trials', pathMatch: 'full', component: IneligibleMaxLifetimeTrialsComponent },
                    { path: 'ineligible-trial-within-last-trial-date', pathMatch: 'full', component: IneligibleTrailWithinLastTrailDateComponent },
                    { path: 'ineligible-no-audio', pathMatch: 'full', component: IneligibleNoAudioComponent },
                    { path: 'ineligible-audio-with-no-streaming-capability', pathMatch: 'full', component: IneligibleAudioWithNoStreamingCapabilityComponent },
                    { path: 'no-match', pathMatch: 'full', component: RadioIdPageComponent, canActivate: [TransactionSessionFlepzSubmittedDataExistsGuard] },
                    { path: 'credential-setup', pathMatch: 'full', component: CredentialSetupComponent, canActivate: [TransactionSessionFlepzSubmittedDataExistsGuard] },
                    { path: 'singlematch-setuploginconfirmation', pathMatch: 'full', component: SingleMatchSetupLoginConfirmationPageComponent },
                    {
                        path: 'multiple-subscriptions-page',
                        pathMatch: 'full',
                        component: MultipleSubscriptionsPageComponent,
                        canActivate: [TransactionSessionFlepzSubmittedDataExistsGuard],
                    },
                    { path: 'singlematch-oac', pathMatch: 'full', component: SingleMatchOACPageComponent },
                    { path: 'closed-subscription', pathMatch: 'full', component: ClosedSubscriptionComponent },
                    {
                        path: 'registration',
                        pathMatch: 'full',
                        component: RegistrationPageComponent,
                        canActivate: [RegistrationGuard],
                    },
                    { path: '', pathMatch: 'full', redirectTo: 'find-account' },
                    {
                        path: 'forgot-password',
                        pathMatch: 'full',
                        data: { useCaseKey: 'RESET_PASSWORD' },
                        component: ForgotPasswordLandingPageComponent,
                        canActivate: [UpdateUsecaseCanActivateService],
                    },
                    { path: 'credential-recovery', pathMatch: 'full', component: CredentialRecoveryComponent },
                    { path: 'multiple-page', pathMatch: 'full', component: ForgotPasswordMultipleAccountPageComponent, canActivate: [ForgotPasswordTransactionStateGuard] },
                    {
                        path: 'verify-your-account',
                        pathMatch: 'full',
                        component: VerifyYourAccountComponent,
                        canActivate: [ForgotPasswordTransactionStateGuard],
                    },
                    { path: 'reset-password', pathMatch: 'full', component: ResetPasswordPageComponent, canActivate: [ResetPasswordCanActivateService] },
                    { path: 'reset-password-mail-confirmation', pathMatch: 'full', component: ResetPasswordLinkConfirmationPageComponent },
                    { path: 'update-password-confirmation', pathMatch: 'full', component: UpdatePasswordConfirmationPageComponent },
                    { path: 'account-not-found', pathMatch: 'full', component: AccountNotFoundComponent },
                    {
                        path: 'reset-password-text-confirmation',
                        pathMatch: 'full',
                        component: ResetPasswordTextConfirmationPageComponent,
                    },
                    {
                        path: 'forgot-username-mail-sent-confirmation',
                        pathMatch: 'full',
                        component: ForgotUsernameEmailSentConfirmationPageComponent,
                    },
                    {
                        path: 'forgot-username-same-mail-confirmation',
                        pathMatch: 'full',
                        component: ForgotUsernameSameEmailConfirmationPageComponent,
                    },
                    {
                        path: 'forgot-username',
                        pathMatch: 'full',
                        data: { useCaseKey: 'RECOVER_USERNAME' },
                        canActivate: [UpdateUsecaseCanActivateService],
                        component: ForgotUsernameLandingPageComponent,
                    },
                    {
                        path: 'multiple-page-username',
                        pathMatch: 'full',
                        component: MultipleAccountPageUsernameComponent,
                        canActivate: [RecoverUsernameTransactionStateGuard],
                    },
                ],
            },
        ]),
        DeStreamingOnboardingStateSetupCredentialsModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiTextInputWithTooltipFormFieldModule,
        SharedSxmUiUiGlobalPersonalInfoModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiAddressFormFieldsModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiDataClickTrackModule,
        DomainsAccountUiSecurityQuestionsFormFieldsModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiSubscriptionSummaryBlockModule,
        DomainsAccountUiSubscriptionStreamingModule,
        DomainsAccountUiRegisterMultiStepModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiUpdatePasswordFormFieldsModule,
        SharedSxmUiUiCredentialRecoveryFormFieldsModule,
        SharedSxmUiUiAccountSummaryBlockModule,
        SharedSxmUiUiVerifyYourAccountFormFieldsModule,
        DomainsIdentityUiDeviceLookupModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiHelpFindingRadioModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiAccountSummaryBlockUsernameModule,
    ],

    declarations: [
        FindAccountPageComponent,
        AccountNotFoundPageComponent,
        IneligibleNonPayPageComponent,
        IneligibleNonConsumerComponent,
        IneligibleInsufficientPackageComponent,
        IneligibleExpiredAATrialComponent,
        IneligibleMaxLifetimeTrialsComponent,
        IneligibleTrailWithinLastTrailDateComponent,
        IneligibleNoAudioComponent,
        IneligibleAudioWithNoStreamingCapabilityComponent,
        SingleMatchSetupLoginConfirmationPageComponent,
        RadioIdPageComponent,
        CredentialSetupComponent,
        MultipleSubscriptionsPageComponent,
        SingleMatchOACPageComponent,
        RegistrationPageComponent,
        ClosedSubscriptionComponent,
        PrivacyPolicyComponent,
        ForgotPasswordLandingPageComponent,
        CredentialRecoveryComponent,
        ForgotPasswordMultipleAccountPageComponent,
        VerifyYourAccountComponent,
        ResetPasswordPageComponent,
        ResetPasswordLinkConfirmationPageComponent,
        UpdatePasswordConfirmationPageComponent,
        AccountNotFoundComponent,
        ResetPasswordTextConfirmationPageComponent,
        ForgotUsernameEmailSentConfirmationPageComponent,
        ForgotUsernameSameEmailConfirmationPageComponent,
        ForgotUsernameLandingPageComponent,
        MultipleAccountPageUsernameComponent,
    ],
    providers: [ProcessInboundUrlResolver, TransactionSessionFlepzSubmittedDataExistsGuard, RegistrationGuard],
})
export class DeStreamingOnboardingFeatureSetupCredentialsModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
