import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SxmUiPlanSelectionComponent } from './plan-selection/plan-selection.component';
import { SharedSxmUiUiPlatformFromPackageNamePipeModule } from '@de-care/shared/sxm-ui/ui-platform-from-package-name-pipe';
import { SharedSxmUiUiWithoutPlatformNamePipeModule } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';

const declarations = [SxmUiPlanSelectionComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiPlatformFromPackageNamePipeModule, SharedSxmUiUiWithoutPlatformNamePipeModule],
    declarations,
    exports: [...declarations]
})
export class SharedSxmUiUiPlanSelectionModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
