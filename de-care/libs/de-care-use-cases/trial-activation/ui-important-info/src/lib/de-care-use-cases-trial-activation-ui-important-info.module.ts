import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialActivationImportantInfoComponent } from './important-info/important-info.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild()],
    declarations: [TrialActivationImportantInfoComponent],
    exports: [TrialActivationImportantInfoComponent]
})
export class DeCareUseCasesTrialActivationUiImportantInfoModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/important-info.en-CA.json') },
            'en-US': { ...require('./i18n/important-info.en-US.json') },
            'fr-CA': { ...require('./i18n/important-info.fr-CA.json') }
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(false);
        }

        super(translateService, languages);
    }
}
