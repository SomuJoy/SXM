import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageShellBasicComponent } from './page-shell-basic/page-shell-basic.component';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { DeCareSharedUiPageFooterBasicModule } from '@de-care/de-care/shared/ui-page-footer-basic';
import { DeCareSharedUiPageLayoutModule } from '@de-care/de-care-shared-ui-page-layout';
import { DeCareSharedUiProvinceSelectionModule } from '@de-care/de-care/shared/ui-province-selection';
import { SharedSxmUiUiIconLogoModule } from '@de-care/shared/sxm-ui/ui-icon-logo';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule.forChild(),
        DeCareSharedUiPageFooterBasicModule,
        SharedSxmUiUiDataClickTrackModule,
        DeCareSharedUiPageLayoutModule,
        DeCareSharedUiProvinceSelectionModule,
        SharedSxmUiUiIconLogoModule,
    ],
    declarations: [PageShellBasicComponent],
    exports: [PageShellBasicComponent],
})
export class DeCareSharedUiPageShellBasicModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
