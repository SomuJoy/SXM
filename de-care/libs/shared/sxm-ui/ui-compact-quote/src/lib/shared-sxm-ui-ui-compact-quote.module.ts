import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageResources, ModuleWithTranslation } from '@de-care/shared/translation';
import { SxmUiCompactQuoteSummaryComponent } from './compact-quote-summary/compact-quote-summary.component';
import { SxmUiCollapsableLineItemComponent } from './collapsable-line-item/collapsable-line-item.component';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';

/**
 * @deprecated Use DomainsQuotesUiCompactQuoteSummaryModule instead
 */
@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule],
    declarations: [SxmUiCompactQuoteSummaryComponent, SxmUiCollapsableLineItemComponent],
    exports: [SxmUiCompactQuoteSummaryComponent, SxmUiCollapsableLineItemComponent],
})
export class SharedSxmUiUiCompactQuoteModule extends ModuleWithTranslation {
    constructor(translateService: TranslateService) {
        const languages: LanguageResources = {
            'en-CA': { ...require('./i18n/module.en-CA.json') },
            'en-US': { ...require('./i18n/module.en-US.json') },
            'fr-CA': { ...require('./i18n/module.fr-CA.json') },
        };
        super(translateService, languages);
    }
}
