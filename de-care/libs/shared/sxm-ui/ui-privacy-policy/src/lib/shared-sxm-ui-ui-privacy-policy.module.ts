import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ModuleWithTranslation, LanguageResources } from '@de-care/app-common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';

const declarations = [PrivacyPolicyComponent];

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiDataClickTrackModule],
    declarations,
    exports: [...declarations]
})
export class SharedSxmUiUiPrivacyPolicyModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/ui-privacy-policy.en-CA.json') },
            'en-US': { ...require('./i18n/ui-privacy-policy.en-US.json') },
            'fr-CA': { ...require('./i18n/ui-privacy-policy.fr-CA.json') }
        };

        super(translateService, languages);
    }
}
