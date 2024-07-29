import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { DeCareUseCasesAccountStateAccountCredentialsManagementModule } from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { ForgotPasswordLandingPageComponent } from './pages/forgot-password-landing-page/forgot-password-landing-page.component';
import { SharedSxmUiUiUpdatePasswordFormFieldsModule } from '@de-care/shared/sxm-ui/ui-update-password-form-fields';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CredentialRecoveryComponent } from './pages/credential-recovery/credential-recovery.component';
import { SharedSxmUiUiCredentialRecoveryFormFieldsModule } from '@de-care/shared/sxm-ui/ui-credential-recovery-form-fields';
import { DeCareSharedUiPageShellBasicModule } from '@de-care/de-care/shared/ui-page-shell-basic';
import { MultipleAccountPageComponent } from './pages/multiple-account-page/multiple-account-page.component';
import { SharedSxmUiUiAccountSummaryBlockModule } from '@de-care/shared/sxm-ui/ui-account-summary-block';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { VerifyYourAccountComponent } from './pages/verify-your-account/verify-your-account.component';
import { SharedSxmUiUiVerifyYourAccountFormFieldsModule } from '@de-care/shared/sxm-ui/ui-verify-your-account-form-fields';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiEnableShowPasswordModule } from '@de-care/shared/sxm-ui/ui-enable-show-password';
import { ResetPasswordLinkConfirmationPageComponent } from './pages/reset-password-link-confirmation-page/reset-password-link-confirmation-page.component';
import { UpdatePasswordConfirmationPageComponent } from './pages/update-password-confirmation-page/update-password-confirmation-page.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { AccountNotFoundComponent } from './pages/account-not-found/account-not-found.component';
import { DomainsIdentityUiDeviceLookupModule } from '@de-care/domains/identity/ui-device-lookup';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { LoadPageGuard } from './load-page-guard';
import { TempIncludeGlobalStyleScriptCanActivateService, UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { LoadPackageDescriptionsCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { ResetPasswordCanActivateService } from './pages/reset-password-page/reset-password-can-activate.service';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { ResetPasswordTextConfirmationPageComponent } from './pages/reset-password-text-confirmation-page/reset-password-text-confirmation-page.component';
import { ForgotUsernameLandingPageComponent } from './pages/forgot-username-landing-page/forgot-username-landing-page.component';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { ForgotUsernameEmailSentConfirmationPageComponent } from './pages/forgot-username-email-sent-confirmation-page/forgot-username-email-sent-confirmation-page.component';
import { ForgotUsernameSameEmailConfirmationPageComponent } from './pages/forgot-username-same-email-confirmation-page/forgot-username-same-email-confirmation-page.component';
import { ShellBasicWithLangToggleComponent, DeCareUseCasesSharedUiShellBasicModule } from '@de-care/de-care-use-cases/shared/ui-shell-basic';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiAccountSummaryBlockUsernameModule } from '@de-care/shared/sxm-ui/ui-account-summary-block-username';
import { MultipleAccountPageUsernameComponent } from './pages/multiple-account-page-username/multiple-account-page-username.component';
import { ForgotPasswordTransactionStateGuard } from './forgot-password-transaction-state-guard';
import { RecoverUsernameTransactionStateGuard } from './recover-username-transaction-state-guard';

const routes: Route[] = [
    {
        path: '',
        component: ShellBasicWithLangToggleComponent,
        canActivate: [TempIncludeGlobalStyleScriptCanActivateService, LoadPackageDescriptionsCanActivateService],
        data: { shellBasicWithLangToggle: { darkMode: true } },
        children: [
            {
                path: '',
                canActivate: [LoadPageGuard],
                pathMatch: 'full',
                component: CredentialRecoveryComponent,
            },
            {
                path: 'forgot-password',
                pathMatch: 'full',
                data: { useCaseKey: 'RESET_PASSWORD' },
                canActivate: [UpdateUsecaseCanActivateService, LoadPageGuard],
                component: ForgotPasswordLandingPageComponent,
            },
            {
                path: 'multiple-page',
                pathMatch: 'full',
                canActivate: [LoadPageGuard, ForgotPasswordTransactionStateGuard],
                component: MultipleAccountPageComponent,
            },
            {
                path: 'verify-your-account',
                pathMatch: 'full',
                canActivate: [LoadPageGuard, ForgotPasswordTransactionStateGuard],
                component: VerifyYourAccountComponent,
            },
            {
                path: 'reset-password',
                pathMatch: 'full',
                canActivate: [LoadPageGuard, ResetPasswordCanActivateService],
                component: ResetPasswordPageComponent,
            },
            {
                path: 'reset-password-mail-confirmation',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: ResetPasswordLinkConfirmationPageComponent,
            },
            {
                path: 'update-password-confirmation',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: UpdatePasswordConfirmationPageComponent,
            },
            {
                path: 'account-not-found',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: AccountNotFoundComponent,
            },
            {
                path: 'reset-password-text-confirmation',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: ResetPasswordTextConfirmationPageComponent,
            },
            {
                path: 'forgot-username-mail-sent-confirmation',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: ForgotUsernameEmailSentConfirmationPageComponent,
            },
            {
                path: 'forgot-username-same-mail-confirmation',
                pathMatch: 'full',
                canActivate: [LoadPageGuard],
                component: ForgotUsernameSameEmailConfirmationPageComponent,
            },
            {
                path: 'forgot-username',
                pathMatch: 'full',
                data: { useCaseKey: 'RECOVER_USERNAME' },
                canActivate: [UpdateUsecaseCanActivateService, LoadPageGuard],
                component: ForgotUsernameLandingPageComponent,
            },
            {
                path: 'multiple-page-username',
                pathMatch: 'full',
                canActivate: [LoadPageGuard, RecoverUsernameTransactionStateGuard],
                component: MultipleAccountPageUsernameComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        DeCareUseCasesAccountStateAccountCredentialsManagementModule,
        SharedSxmUiUiUpdatePasswordFormFieldsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedSxmUiUiCredentialRecoveryFormFieldsModule,
        DeCareSharedUiPageShellBasicModule,
        SharedSxmUiUiAccountSummaryBlockModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiVerifyYourAccountFormFieldsModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiEnableShowPasswordModule,
        DomainsIdentityUiDeviceLookupModule,
        DeCareUseCasesSharedUiPageMainModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiHelpFindingRadioModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiAlertPillModule,
        SharedValidationFormControlInvalidModule,
        DeCareUseCasesSharedUiShellBasicModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiAccountSummaryBlockUsernameModule,
    ],
    declarations: [
        ForgotPasswordLandingPageComponent,
        CredentialRecoveryComponent,
        MultipleAccountPageComponent,
        ResetPasswordLinkConfirmationPageComponent,
        UpdatePasswordConfirmationPageComponent,
        VerifyYourAccountComponent,
        ResetPasswordPageComponent,
        AccountNotFoundComponent,
        ResetPasswordTextConfirmationPageComponent,
        ForgotUsernameEmailSentConfirmationPageComponent,
        ForgotUsernameSameEmailConfirmationPageComponent,
        ForgotUsernameLandingPageComponent,
        MultipleAccountPageUsernameComponent,
    ],
    providers: [LoadPageGuard],
})
export class DeCareUseCasesAccountFeatureAccountCredentialsManagementModule {}
