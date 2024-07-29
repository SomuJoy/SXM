import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnableShowPasswordComponent } from './enable-show-password/enable-show-password.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [EnableShowPasswordComponent],
    exports: [EnableShowPasswordComponent]
})
export class SharedSxmUiUiEnableShowPasswordModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
