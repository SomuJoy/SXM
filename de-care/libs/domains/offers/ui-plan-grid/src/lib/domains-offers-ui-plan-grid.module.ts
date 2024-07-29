import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlanGridComponent } from './plan-grid/plan-grid.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [PlanGridComponent],
    exports: [PlanGridComponent]
})
export class DomainsOffersUiPlanGridModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json')
        };
        super(translateService, languages);
    }
}
