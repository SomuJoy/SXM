import { SharedSxmUiUiMaskEmailPipeModule } from '@de-care/shared/sxm-ui/ui-mask-email-pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SharedRegisterYourAccountComponent } from './register-your-account/register-your-account.component';
import { RecoverPasswordQuestionsPipe } from './recover-password-questions.pipe';
import { ModuleWithTranslation, LanguageResources } from '@de-care/shared/translation';
import { SharedSxmUiUiIconCheckmarkModule } from '@de-care/shared/sxm-ui/ui-icon-checkmark';

const DECLARATIONS = [SharedRegisterYourAccountComponent, RecoverPasswordQuestionsPipe];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule.forChild(),
        SxmUiModule,
        SharedSxmUiUiMaskEmailPipeModule,
        SharedSxmUiUiIconCheckmarkModule,
    ],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS],
})
export class DomainsAccountUiRegisterModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/register.en-CA.json'),
            'en-US': require('./i18n/register.en-US.json'),
            'fr-CA': require('./i18n/register.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
