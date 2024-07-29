import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SettingsService, UserSettingsService } from '@de-care/settings';
import { ReadyToExploreComponent } from './ready-to-explore/ready-to-explore.component';
import { DomainsSubscriptionsUiPlayerAppIntegrationModule } from '@de-care/domains/subscriptions/ui-player-app-integration';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), DomainsSubscriptionsUiPlayerAppIntegrationModule],
    declarations: [ReadyToExploreComponent],
    exports: [ReadyToExploreComponent],
})
export class DeCareUseCasesTrialActivationUiReadyToExploreModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService, settingService: SettingsService, userSettingsService: UserSettingsService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ready-to-explore.en-CA.json') },
            'en-US': { ...require('./i18n/ready-to-explore.en-US.json') },
            'fr-CA': { ...require('./i18n/ready-to-explore.fr-CA.json') },
        };

        if (settingService.isCanadaMode) {
            userSettingsService.setProvinceSelectionVisible(false);
        }

        super(translateService, languages);
    }
}
