import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SxmUiPickAPlanFormComponent } from './pick-a-plan-form/pick-a-plan-form.component';
import { SharedSxmUiUiPlanSelectionModule } from '@de-care/shared/sxm-ui/ui-plan-selection';
import { SharedSxmUiUiPlanComparisonGridModule } from '@de-care/shared/sxm-ui/ui-plan-comparison-grid';

const declarations = [SxmUiPickAPlanFormComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiPlanSelectionModule, SharedSxmUiUiPlanComparisonGridModule],
    declarations,
    exports: [...declarations]
})
export class SharedSxmUiUiPickAPlanFormModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') }
        };
        super(translateService, languages);
    }
}
