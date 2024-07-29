import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiListenOnDevicesInfoComponent } from './listen-on-devices-info/listen-on-devices-info.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { ReactiveComponentModule } from '@ngrx/component';
@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiModalModule, ReactiveComponentModule],
    declarations: [SxmUiListenOnDevicesInfoComponent],
    exports: [SxmUiListenOnDevicesInfoComponent],
})
export class SharedSxmUiUiListenOnDevicesModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
