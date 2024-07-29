import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { VerifyOptionsFormComponent } from './verify-options-form/verify-options-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiRadioOptionFormFieldModule } from '@de-care/shared/sxm-ui/ui-radio-option-form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SecurityCodeVerificationFormComponent } from './security-code-verification-form/security-code-verification-form.component';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { TwoFactorAuthModalComponent } from './two-factor-auth-modal/two-factor-auth-modal.component';
import { DomainsAccountStateTwoFactorAuthModule } from '@de-care/domains/account/state-two-factor-auth';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '@de-care/shared/sxm-ui/ui-checkbox-with-label-form-field';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SharedSxmUiUiPrivacyPolicyModule } from '@de-care/shared/sxm-ui/ui-privacy-policy';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '@de-care/shared/sxm-ui/ui-phone-number-form-field';
import { SharedAsyncValidatorsPhoneNumberVerificationModule } from '@de-care/shared/async-validators/phone-number-verification';
import { SharedSxmUiUiNumericFormFieldModule } from '@de-care/shared/sxm-ui/ui-numeric-form-field';
import { SharedSxmUiUiHelpFindingRadioModule } from '@de-care/shared/sxm-ui/ui-help-finding-radio';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiOneTimeCodeFormFieldModule } from '@de-care/shared/sxm-ui/ui-one-time-code-form-field';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedSxmUiUiRadioOptionFormFieldModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiCheckboxWithLabelFormFieldModule,
        SharedSxmUiUiAlertPillModule,
        SharedSxmUiUiModalModule,
        SharedSxmUiUiPrivacyPolicyModule,
        TranslateModule.forChild(),
        DomainsAccountStateTwoFactorAuthModule,
        SharedSxmUiUiPhoneNumberFormFieldModule,
        SharedAsyncValidatorsPhoneNumberVerificationModule,
        SharedSxmUiUiNumericFormFieldModule,
        SharedSxmUiUiHelpFindingRadioModule,
        DomainsChatUiChatWithAgentLinkModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiOneTimeCodeFormFieldModule
    ],
    declarations: [VerifyOptionsFormComponent, SecurityCodeVerificationFormComponent, TwoFactorAuthModalComponent],
    exports: [VerifyOptionsFormComponent, SecurityCodeVerificationFormComponent, TwoFactorAuthModalComponent]
})
export class DomainsAccountUiTwoFactorAuthModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-two-factor-auth.en-CA.json') },
            'en-US': { ...require('./i18n/ui-two-factor-auth.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-two-factor-auth.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
