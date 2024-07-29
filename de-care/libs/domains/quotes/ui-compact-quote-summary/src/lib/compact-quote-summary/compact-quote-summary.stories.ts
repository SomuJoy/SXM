import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { DomainsQuotesUiCompactQuoteSummaryModule, CompactQuoteData } from './compact-quote-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const stories = storiesOf('Component Library/UI/Compact Quotes/Compact Quote Summary', module)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, DomainsQuotesUiCompactQuoteSummaryModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withKnobs)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-compact-quote-summary [compactQuoteData]="compactQuoteData"></sxm-ui-compact-quote-summary>`,
    props: {
        compactQuoteData: {
            title: {
                label: 'Due Today',
                amount: '$0',
            },
            quoteBlocks: [
                {
                    innerLines: [
                        { label: 'Platinum', amount: '$20.55' },
                        { label: 'U.S. Music Royalty Fee', amount: '$5.20' },
                    ],
                    outerLine: {
                        label: 'One time prorated payments starting 04/22/2022',
                        amount: '$25.75',
                        tooltip: 'The length and the amount due for this billing period have been adjusted to match your billing date.',
                    },
                },
                {
                    innerLines: [
                        { label: 'Platinum', amount: '$53.97' },
                        { label: 'U.S. Music Royalty Fee', amount: '$11.55' },
                        { label: 'State Tax', amount: '$0.08' },
                    ],
                    outerLine: {
                        label: 'Recurring quarterly payments starting 04/25/2023',
                        amount: '$65.52',
                    },
                },
            ],
        } as CompactQuoteData,
    },
}));
