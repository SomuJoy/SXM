import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageHeaderBasicComponent } from './page-header-basic/page-header-basic.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [PageHeaderBasicComponent],
    exports: [PageHeaderBasicComponent]
})
export class SharedSxmUiUiPageHeaderBasicModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {},
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
