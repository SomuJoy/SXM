import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectTermTypeFormComponent } from './select-term-type-form/select-term-type-form.component';
import { SxmUiModule } from '@de-care/sxm-ui';

const DECLARATIONS = [SelectTermTypeFormComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SxmUiModule],
    declarations: [...DECLARATIONS],
    exports: [...DECLARATIONS]
})
export class DeCareUseCasesChangeSubscriptionUiCommonModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-common.en-CA.json') },
            'en-US': { ...require('./i18n/ui-common.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-common.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
