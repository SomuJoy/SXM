import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiAppFooterComponent } from './app-footer/app-footer.component';

@NgModule({
    declarations: [SxmUiAppFooterComponent],
    imports: [CommonModule, TranslateModule.forChild()],
    exports: [SxmUiAppFooterComponent]
})
export class SharedSxmUiUiAppFooterModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
