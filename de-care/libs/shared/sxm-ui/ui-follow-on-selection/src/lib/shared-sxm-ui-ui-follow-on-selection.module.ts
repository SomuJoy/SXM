import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiModule } from '@de-care/sxm-ui';
import { FollowOnSelectionComponent } from './follow-on-selection/follow-on-selection.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule],
    declarations: [FollowOnSelectionComponent],
    exports: [FollowOnSelectionComponent]
})
export class SharedSxmUiUiFollowOnSelectionModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
