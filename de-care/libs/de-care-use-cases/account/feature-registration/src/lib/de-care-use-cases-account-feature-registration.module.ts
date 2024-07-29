import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { DomainsCustomerStateAddressVerificationModule } from '@de-care/domains/customer/state-customer-verification';
import { DomainsAccountStateSecurityQuestionsModule } from '@de-care/domains/account/state-security-questions';
import { SharedSxmUiUiNumericFormFieldModule } from '@de-care/shared/sxm-ui/ui-numeric-form-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LanguageResources, ModuleWithTranslation, PackageDescriptionTranslationsResolver } from '@de-care/app-common';
import { DeCareUseCasesAccountStateRegistrationModule, RegistrationPageGuard } from '@de-care/de-care-use-cases/account/state-registration';
import { DeCareUseCasesSharedUiPageMainModule } from '@de-care/de-care-use-cases/shared/ui-page-main';
import { DeCareUseCasesSharedUiShellModule } from '@de-care/de-care-use-cases/shared/ui-shell';
import { DomainsAccountUiAccountAndSubscriptionsInfoModule } from '@de-care/domains/account/ui-account-and-subscriptions-info';
import { DomainsAccountUiLoginFormFieldsModule } from '@de-care/domains/account/ui-login-form-fields';
import { DomainsAccountUiSecurityQuestionsFormFieldsModule } from '@de-care/domains/account/ui-security-questions-form-fields';
import { DomainsAccountUiTwoFactorAuthModule } from '@de-care/domains/account/ui-two-factor-auth';
import { SharedSxmUiUiEmailFormFieldModule } from '@de-care/shared/sxm-ui/ui-email-form-field';
import { SharedSxmUiUiFlepzFormFieldsModule } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { SharedSxmUiUiStepperModule } from '@de-care/shared/sxm-ui/ui-stepper';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CanActivateRegistrationVerifyGuardService } from './feature-registration-verify.guard.service';
import { AccountLookupComponent } from './pages/account-lookup-page/account-lookup.component';
import { IdentificationPageComponent } from './pages/identification-page/identification-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { RegistrationCompletedPageComponent } from './pages/registration-completed-page/registration-completed-page.component';
import { SelectAccountAndVerifyComponent } from './pages/select-account-and-verify/select-account-and-verify.component';
import { UiLookupByRadioIdOrAccountNumberComponent } from './page-parts/ui-lookup-by-radio-id-or-account-number/ui-lookup-by-radio-id-or-account-number.component';
import { HelpFindRadioIdModalComponent } from './page-parts/help-find-radio-id-modal/help-find-radio-id-modal.component';
import { LookupYourMarineOrAviationDeviceModalComponent } from './page-parts/lookup-your-marine-or-aviation-device-modal/lookup-your-marine-or-aviation-device-modal.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { CanActivateRegistrationLookupGuardService } from './feature-registration-lookup.guard.service';
import { CnaPageComponent } from './pages/cna-page/cna-page.component';
import { DomainsCustomerUiVerifyAddressModule } from '@de-care/domains/customer/ui-verify-address';
import { CanActivateRegistrationCNAGuardService } from './feature-registration-cna.guard.service';
import { UiLookupByRadioIdOrAccountNumberModalComponent } from './page-parts/ui-lookup-by-radio-id-or-account-number-modal/ui-lookup-by-radio-id-or-account-number-modal.component';
import { AccountAlreadyRegisteredComponent } from './pages/account-already-registered/account-already-registered.component';
import { CanActivateRegistrationAlreadyRegisteredGuardService } from './feature-registration-registered.guard.service';
import { SharedSxmUiUiSideTitleModule } from '@de-care/shared/sxm-ui/ui-side-title';
import { CanActivateRegistrationStepUpGuardService } from './feature-registration-step-up.guard.service';
import { UiLookupByRadioIdOrAccountNumberErrorsComponent } from './page-parts/ui-lookup-by-radio-id-or-account-number-errors/ui-lookup-by-radio-id-or-account-number-errors.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';
import { SharedSxmUiUiDotProgressBarStepperModule } from '@de-care/shared/sxm-ui/ui-dot-progress-bar-stepper';
import { UpdateUsecaseCanActivateService } from '@de-care/de-care-use-cases/shared/ui-router-common';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { PageProcessingMessageComponent } from '@de-care/de-care/shared/ui-page-shell-basic';

const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        component: IdentificationPageComponent,
        resolve: { allPackageDescriptions: PackageDescriptionTranslationsResolver },
        data: { useCaseKey: 'REGISTRATION' },
        canActivate: [UpdateUsecaseCanActivateService],
    },
    { path: 'lookup', component: AccountLookupComponent, canActivate: [CanActivateRegistrationLookupGuardService] },
    {
        path: 'step-up',
        data: { useCaseKey: 'REGISTRATION' },
        canActivate: [UpdateUsecaseCanActivateService, CanActivateRegistrationStepUpGuardService],
        component: PageProcessingMessageComponent,
    },
    {
        path: 'verify',
        component: SelectAccountAndVerifyComponent,
        canActivate: [CanActivateRegistrationVerifyGuardService],
    },
    { path: 'cna', component: CnaPageComponent, canActivate: [CanActivateRegistrationCNAGuardService] },
    { path: 'registered', component: AccountAlreadyRegisteredComponent, canActivate: [CanActivateRegistrationAlreadyRegisteredGuardService] },
    { path: 'register', component: RegisterPageComponent, canActivate: [RegistrationPageGuard] },
    { path: 'completed', component: RegistrationCompletedPageComponent },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        ReactiveFormsModule,
        DeCareUseCasesSharedUiShellModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiFlepzFormFieldsModule,
        SharedSxmUiUiStepperModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        DomainsAccountUiSecurityQuestionsFormFieldsModule,
        DeCareUseCasesSharedUiPageMainModule,
        DeCareUseCasesAccountStateRegistrationModule,
        DomainsAccountUiTwoFactorAuthModule,
        DomainsAccountUiAccountAndSubscriptionsInfoModule,
        DomainsAccountUiLoginFormFieldsModule,
        DomainsAccountStateSecurityQuestionsModule,
        DomainsCustomerStateAddressVerificationModule,
        SharedSxmUiUiEmailFormFieldModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedSxmUiUiPrivacyPolicyModule,
        SharedSxmUiUiNumericFormFieldModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiTooltipModule,
        DomainsCustomerUiVerifyAddressModule,
        SharedSxmUiUiSideTitleModule,
        DomainsChatUiChatWithAgentLinkModule,
        DomainsSubscriptionsUiPlayerAppIntegrationModule,
        SharedSxmUiUiDotProgressBarStepperModule,
        SharedSxmUiUiAlertPillModule,
    ],
    declarations: [
        IdentificationPageComponent,
        SelectAccountAndVerifyComponent,
        RegisterPageComponent,
        RegistrationCompletedPageComponent,
        AccountLookupComponent,
        UiLookupByRadioIdOrAccountNumberComponent,
        HelpFindRadioIdModalComponent,
        LookupYourMarineOrAviationDeviceModalComponent,
        CnaPageComponent,
        UiLookupByRadioIdOrAccountNumberModalComponent,
        AccountAlreadyRegisteredComponent,
        UiLookupByRadioIdOrAccountNumberErrorsComponent,
    ],
})
export class DeCareUseCasesAccountFeatureRegistrationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json'), ...require('libs/app-common/src/lib/i18n/app.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json'), ...require('libs/app-common/src/lib/i18n/app.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json'), ...require('libs/app-common/src/lib/i18n/app.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
