import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { HelpFindingRadioModalComponent } from './help-finding-radio-modal/help-finding-radio-modal.component';
import { SxmUiHelpFindingRadioComponent } from './help-finding-radio/help-finding-radio.component';
import { SxmUiDeviceHelpComponent } from './device-help/device-help.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SxmUiHelpFindingRadioAccordionComponent } from './help-finding-radio-accordion/help-finding-radio-accordion.component';
import { SxmUiModule } from '@de-care/sxm-ui';
import { SXMUiHelpFindingRadioAndAccountComponent } from './help-finding-radio-and-account/help-finding-radio-and-account.component';
import { DomainsChatUiChatWithAgentLinkModule } from '@de-care/domains/chat/ui-chat-with-agent-link';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiModalModule, SxmUiModule, DomainsChatUiChatWithAgentLinkModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [
        SxmUiHelpFindingRadioComponent,
        SXMUiHelpFindingRadioAndAccountComponent,
        SxmUiDeviceHelpComponent,
        HelpFindingRadioModalComponent,
        SxmUiHelpFindingRadioAccordionComponent,
    ],
    exports: [
        SxmUiHelpFindingRadioComponent,
        SXMUiHelpFindingRadioAndAccountComponent,
        SxmUiDeviceHelpComponent,
        HelpFindingRadioModalComponent,
        SxmUiHelpFindingRadioAccordionComponent,
    ],
})
export class SharedSxmUiUiHelpFindingRadioModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-help-finding-radio.en-CA.json') },
            'en-US': { ...require('./i18n/ui-help-finding-radio.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-help-finding-radio.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
