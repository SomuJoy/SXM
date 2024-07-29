import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiSxmInCarPlusStreamingComponent } from './sxm-in-car-plus-streaming/sxm-in-car-plus-streaming.component';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

const declarations = [SxmUiSxmInCarPlusStreamingComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations,
    exports: [...declarations]
})
export class SharedSxmUiUiSxmInCarPlusStreamingModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
