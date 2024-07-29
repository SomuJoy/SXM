import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { PageFooterBasicComponent } from './page-footer-basic/page-footer-basic.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [PageFooterBasicComponent],
    exports: [PageFooterBasicComponent],
})
export class DeCareSharedUiPageFooterBasicModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
