import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiPrimaryPackageCardComponent } from './primary-package-card/primary-package-card.component';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiPackageIconsModule } from '@de-care/shared/sxm-ui/ui-package-icons';
import { SharedSxmUiUiSafeHtmlModule } from '@de-care/shared/sxm-ui/ui-safe-html';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SxmUiPlanRecapCardComponent } from './plan-recap-card/plan-recap-card.component';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild(),
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiPackageIconsModule,
        SharedSxmUiUiSafeHtmlModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiModalModule,
        ReactiveComponentModule,
    ],
    declarations: [SxmUiPrimaryPackageCardComponent, SxmUiPlanRecapCardComponent],
    exports: [SxmUiPrimaryPackageCardComponent, SxmUiPlanRecapCardComponent],
})
export class SharedSxmUiUiPrimaryPackageCardModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': require('./i18n/module.en-CA.json'),
            'en-US': require('./i18n/module.en-US.json'),
            'fr-CA': require('./i18n/module.fr-CA.json'),
        };
        super(translateService, languages);
    }
}
