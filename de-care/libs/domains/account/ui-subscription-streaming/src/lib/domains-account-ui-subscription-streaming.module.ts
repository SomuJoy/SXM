import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { SharedSxmUiUiPasswordFormFieldModule } from '@de-care/shared/sxm-ui/ui-password-form-field';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiSubscriptionSummaryBlockModule } from '@de-care/shared/sxm-ui/ui-subscription-summary-block';
import { SharedSxmUiUiTextFormFieldModule } from '@de-care/shared/sxm-ui/ui-text-form-field';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedValidationFormControlInvalidModule } from '@de-care/shared/validation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CredentialsFoundSignInComponent } from './page-parts/credentials-found-sign-in/credentials-found-sign-in.component';
import { SetupSubscriptionCredentialsFormComponent } from './page-parts/setup-subscription-credentials-form/setup-subscription-credentials-form.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiTextFormFieldModule,
        SharedSxmUiUiPasswordFormFieldModule,
        SharedSxmUiUiModalModule,
        SharedValidationFormControlInvalidModule,
        SharedSxmUiUiSubscriptionSummaryBlockModule
    ],
    declarations: [CredentialsFoundSignInComponent, SetupSubscriptionCredentialsFormComponent],
    exports: [CredentialsFoundSignInComponent, SetupSubscriptionCredentialsFormComponent]
})
export class DomainsAccountUiSubscriptionStreamingModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
