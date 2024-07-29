import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SxmUiStreamingPlayerLinkComponent } from './streaming-player-link/streaming-player-link.component';

const declarations = [SxmUiStreamingPlayerLinkComponent];

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule, TranslateModule.forChild()],
    declarations,
    exports: declarations,
})
/**
 * @deprecated Use DomainsSubscriptionsUiPlayerAppIntegrationModule from @de-care/domains/subscriptions/ui-player-app-integration
 */
export class SharedSxmUiUiStreamingPlayerLinkModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
