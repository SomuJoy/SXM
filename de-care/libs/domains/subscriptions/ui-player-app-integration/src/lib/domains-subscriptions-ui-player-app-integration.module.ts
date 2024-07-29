import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { StreamingPlayerLinkComponent } from './streaming-player-link/streaming-player-link.component';
import { ListenNowComponent } from './listen-now/listen-now.component';
import { FormsModule } from '@angular/forms';
import { ListenNowWithIconComponent } from './listen-now-with-icon/listen-now-with-icon.component';
import { ListenNowInlineComponent } from './listen-now-inline/listen-now-inline.component';
import { ListenNowWithGenreSelectionComponent } from './listen-now-with-genre-selection/listen-now-with-genre-selection.component';
import { CredentialRecoveryHandshakeComponent } from './credential-recovery-handshake/credential-recovery-handshake.component';
import { SharedSxmUiUiIconStreamingModule } from '@de-care/shared/sxm-ui/ui-icon-streaming';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
    imports: [CommonModule, FormsModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule, SharedSxmUiUiIconStreamingModule],
    declarations: [
        StreamingPlayerLinkComponent,
        ListenNowComponent,
        ListenNowWithIconComponent,
        ListenNowWithGenreSelectionComponent,
        CredentialRecoveryHandshakeComponent,
        ListenNowInlineComponent,
    ],
    exports: [
        StreamingPlayerLinkComponent,
        ListenNowComponent,
        ListenNowWithIconComponent,
        ListenNowWithGenreSelectionComponent,
        CredentialRecoveryHandshakeComponent,
        ListenNowInlineComponent,
        LayoutModule,
    ],
})
export class DomainsSubscriptionsUiPlayerAppIntegrationModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
