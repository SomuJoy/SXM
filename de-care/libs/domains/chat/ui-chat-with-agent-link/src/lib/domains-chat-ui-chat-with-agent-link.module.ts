import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/app-common';
import { ChatWithAgentLinkComponent } from './chat-with-agent-link/chat-with-agent-link.component';
import { ChatLinkLivepersonComponent } from './chat-link-liveperson/chat-link-liveperson.component';
import { ChatLinkTwentyFourSevenComponent } from './chat-link-twenty-four-seven/chat-link-twenty-four-seven.component';
import { ChatWithAgentButtonComponent } from './chat-with-agent-button/chat-with-agent-button.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), ChatWithAgentButtonComponent],
    declarations: [ChatWithAgentLinkComponent, ChatLinkLivepersonComponent, ChatLinkTwentyFourSevenComponent],
    exports: [ChatWithAgentLinkComponent, ChatWithAgentButtonComponent],
})
export class DomainsChatUiChatWithAgentLinkModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
