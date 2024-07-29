import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { DeCareUseCasesSharedUiProvinceSelectorModule } from '@de-care/de-care-use-cases/shared/ui-province-selector';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { DomainsSxmUiUiLogoLinkModule } from '@de-care/shared/sxm-ui/ui-logo-link';

@NgModule({
    imports: [TranslateModule.forChild(), CommonModule, SxmUiModule, DeCareUseCasesSharedUiProvinceSelectorModule, DomainsSxmUiUiLogoLinkModule],
    declarations: [HeaderBarComponent],
    exports: [HeaderBarComponent]
})
export class DeCareUseCasesSharedUiHeaderBarModule extends ModuleWithTranslation {
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
