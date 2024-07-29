import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { OfferGridFormComponent } from './offer-grid-form/offer-grid-form.component';
import { FormsModule } from '@angular/forms';
import { SharedSxmUiUiProceedButtonModule } from '@de-care/shared/sxm-ui/ui-proceed-button';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { SharedSxmUiUiWithoutPlatformNamePipeModule, WithoutPlatformNamePipe } from '@de-care/shared/sxm-ui/ui-without-platform-name-pipe';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
        SharedSxmUiUiTooltipModule,
        SharedSxmUiUiProceedButtonModule,
        SharedSxmUiUiAccordionChevronModule,
        SharedSxmUiUiDataClickTrackModule,
        SharedSxmUiUiWithoutPlatformNamePipeModule,
    ],
    declarations: [OfferGridFormComponent],
    exports: [OfferGridFormComponent],
    providers: [WithoutPlatformNamePipe],
})
export class SharedSxmUiUiOfferGridModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
