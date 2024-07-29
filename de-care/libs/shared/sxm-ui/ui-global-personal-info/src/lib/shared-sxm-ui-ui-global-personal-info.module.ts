import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalPersonalInfoComponent } from './global-personal-info/global-personal-info.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';

@NgModule({
    imports: [CommonModule, TranslateModule],
    declarations: [GlobalPersonalInfoComponent],
    exports: [GlobalPersonalInfoComponent]
})
export class SharedSxmUiUiGlobalPersonalInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
