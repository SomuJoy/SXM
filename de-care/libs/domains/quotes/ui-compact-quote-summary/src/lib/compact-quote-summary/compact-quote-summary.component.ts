import { NgModule, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CollapsableData } from '../collapsable-line-item/collapsable-line-item.component';
import { ComponentLocale, ComponentWithLocale, LanguageResources, TranslationsForComponentService } from '@de-care/shared/translation';

export interface LineItem {
    amount: string;
    label: string;
    tooltip?: string;
}
export interface CompactQuoteBlock {
    innerLines: LineItem[];
    outerLine: LineItem;
}

export interface CompactQuoteData {
    quoteBlocks: CompactQuoteBlock[];
    title: LineItem;
}

@ComponentLocale({
    languageResources: {
        'en-CA': { ...require('./messages.en-CA.json') },
        'en-US': { ...require('./messages.en-US.json') },
        'fr-CA': { ...require('./messages.fr-CA.json') },
    },
})
@Component({
    selector: 'de-care-compact-quote-summary',
    templateUrl: './compact-quote-summary.component.html',
    styleUrls: ['./compact-quote-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeCareCompactQuoteSummaryComponent implements ComponentWithLocale {
    languageResources: LanguageResources;
    translateKeyPrefix: string;
    dueToday: string;
    futureQuoteData: CollapsableData;
    promoRenewalQuoteData: CollapsableData;
    renewalQuoteData: CollapsableData;
    @Input() compactQuoteData: CompactQuoteData;
    @Input() detailsCollapsed = true;
    @Input() priceChangeMessagingTypeFeatureFlag: boolean;
    @Input() priceChangeMessagingType: string;

    constructor(readonly translationsForComponentService: TranslationsForComponentService) {
        translationsForComponentService.init(this);
    }

    toggleDetails() {
        this.detailsCollapsed = !this.detailsCollapsed;
    }
}

import { DeCareCollapsableLineItemComponent } from '../collapsable-line-item/collapsable-line-item.component';
import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { DomainsOffersUiPriceIncreaseMessageModule } from '@de-care/domains/offers/ui-price-increase-message';

@NgModule({
    imports: [CommonModule, TranslateModule.forChild(), SharedSxmUiUiTooltipModule, DomainsOffersUiPriceIncreaseMessageModule],
    declarations: [DeCareCompactQuoteSummaryComponent, DeCareCollapsableLineItemComponent],
    exports: [DeCareCompactQuoteSummaryComponent, DeCareCollapsableLineItemComponent],
})
export class DomainsQuotesUiCompactQuoteSummaryModule {}
