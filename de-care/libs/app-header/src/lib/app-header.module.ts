import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { CommonModule } from '@angular/common';
import { ProvinceSelectorComponent } from './province-selector/province-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const DECLARATIONS = [HeaderBarComponent, ProvinceSelectorComponent];

@NgModule({
    imports: [TranslateModule.forChild(), CommonModule, SxmUiModule, FormsModule, ReactiveFormsModule],
    declarations: [...DECLARATIONS, ProvinceSelectorComponent],
    exports: [...DECLARATIONS]
})
export class AppHeaderModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': {
                ...require('./i18n/app-header.en-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-CA.json')
            },
            'en-US': {
                ...require('./i18n/app-header.en-US.json'),
                ...require('libs/app-common/src/lib/i18n/app.en-US.json')
            },
            'fr-CA': {
                ...require('./i18n/app-header.fr-CA.json'),
                ...require('libs/app-common/src/lib/i18n/app.fr-CA.json')
            }
        };
        super(translateService, languages);
    }
}
