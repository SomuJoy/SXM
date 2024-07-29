import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiListenNowComponent } from './listen-now/listen-now.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedSxmUiUiStreamingPlayerLinkModule } from '@de-care/shared/sxm-ui/ui-streaming-player-link';
import { SxmUiListenNowOnAppComponent } from './listen-now-on-app/listen-now-on-app.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiStreamingPlayerLinkModule],
    declarations: [SxmUiListenNowComponent, SxmUiListenNowOnAppComponent],
    exports: [SxmUiListenNowComponent, SxmUiListenNowOnAppComponent],
})
export class SharedSxmUiUiListenNowModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };

        super(translateService, languages);
    }
}
