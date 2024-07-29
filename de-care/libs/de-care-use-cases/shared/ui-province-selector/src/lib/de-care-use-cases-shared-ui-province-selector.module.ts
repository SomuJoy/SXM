import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { SxmUiModule } from '@de-care/sxm-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProvinceSelectorComponent } from './province-selector/province-selector.component';

@NgModule({
    imports: [TranslateModule.forChild(), CommonModule, SxmUiModule, FormsModule, ReactiveFormsModule],
    declarations: [ProvinceSelectorComponent],
    exports: [ProvinceSelectorComponent]
})
export class DeCareUseCasesSharedUiProvinceSelectorModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/province-selector.en-CA.json'),
            'en-US': require('./i18n/province-selector.en-US.json'),
            'fr-CA': require('./i18n/province-selector.fr-CA.json')
        };
        super(translateService, languages);
    }
}
