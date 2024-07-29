import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { DeCareUseCasesSharedUiProvinceSelectorModule } from '@de-care/de-care-use-cases/shared/ui-province-selector';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderBarCanadaComponent } from './header-bar-canada/header-bar-canada.component';
import { DomainsSxmUiUiLogoLinkModule } from '@de-care/shared/sxm-ui/ui-logo-link';

@NgModule({
    imports: [TranslateModule.forChild(), CommonModule, SxmUiModule, DeCareUseCasesSharedUiProvinceSelectorModule, DomainsSxmUiUiLogoLinkModule],
    declarations: [HeaderBarCanadaComponent],
    exports: [HeaderBarCanadaComponent]
})
export class DeCareUseCasesSharedUiHeaderBarModuleCanada extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/app-header-canada.en-CA.json') },
            'en-US': { ...require('./i18n/app-header-canada.en-US.json') },
            'fr-CA': { ...require('./i18n/app-header-canada.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
