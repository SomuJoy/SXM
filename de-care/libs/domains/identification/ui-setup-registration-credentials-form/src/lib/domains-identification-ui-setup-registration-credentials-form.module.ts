import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SetupRegistrationCredentialsComponent } from './setup-registration-credentials/setup-registration-credentials.component';
import { RecoverPasswordQuestionsPipe } from './recover-password-questions.pipe';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';

const DECLARATIONS = [SetupRegistrationCredentialsComponent, RecoverPasswordQuestionsPipe];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule, TranslateModule.forChild(), SxmUiModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DomainsIdentificationUiSetupRegistrationCredentialsFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
