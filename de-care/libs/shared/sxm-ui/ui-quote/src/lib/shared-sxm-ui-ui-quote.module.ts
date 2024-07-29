import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiQuoteSummaryComponent } from './quote-summary/quote-summary.component';
import { SharedSxmUiUiAccordionChevronModule } from '@de-care/shared/sxm-ui/ui-accordion-chevron';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { StandaloneLineItemComponent } from './standalone-line-item/standalone-line-item.component';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiAccordionChevronModule, SharedSxmUiUiTooltipModule],
    declarations: [SxmUiQuoteSummaryComponent, StandaloneLineItemComponent],
    exports: [SxmUiQuoteSummaryComponent, StandaloneLineItemComponent],
})
export class SharedSxmUiUiQuoteModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
