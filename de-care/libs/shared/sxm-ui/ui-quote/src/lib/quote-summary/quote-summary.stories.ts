import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiQuoteModule } from '../shared-sxm-ui-ui-quote.module';
import { QuoteData } from './quote-summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const stories = storiesOf('Component Library/UI/Quotes/Quote Summary', module)
    .addDecorator(
        moduleMetadata({
            imports: [BrowserAnimationsModule, SharedSxmUiUiQuoteModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withKnobs)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-quote-summary [quoteData]="quoteData"></sxm-ui-quote-summary>`,
    props: {
        quoteData: {
            currentCharges: {
                planTermLength: 3,
                planPricePerMonth: '$0.33',
                totalDue: '$1.23',
                planName: 'SiriusXM Streaming Platinum',
                planSubtotal: '$1.00',
                fees: [{ amount: '$0.09', label: 'U.S. Music Royalty Fee' }],
                taxes: [
                    { amount: '$0.08', label: 'State Tax' },
                    { amount: '$0.06', label: 'Other Tax' },
                ],
            },
            renewalCharges: {
                startDate: '01/22/2022',
                totalDueOnStartDate: '$13.48',
                planName: 'SiriusXM Streaming Platinum',
                planSubtotal: '$10.99',
                fees: [{ amount: '$0.97', label: 'U.S. Music Royalty Fee' }],
                taxes: [
                    { amount: '$0.89', label: 'State Tax' },
                    { amount: '$0.63', label: 'Other Tax' },
                ],
            },
        } as QuoteData,
    },
}));

stories.add('swap', () => ({
    template: `<sxm-ui-quote-summary [quoteData]="quoteData"></sxm-ui-quote-summary>`,
    props: {
        quoteData: {
            currentCharges: {
                totalTaxesAndFeesAmount: '$26.95',
                fees: [{ amount: '$15.00', label: 'Replacement Fee' }],
                taxes: [{ amount: '$1.95', label: 'State Tax' }],
                totalDue: '$16.95',
                previousBalance: {
                    label: 'Previous Balance',
                    amount: '$10.00',
                    tooltip: 'You have a previously unpaid balance on your account and this balance must be satisfied before you can complete your transaction.',
                },
            },
        } as QuoteData,
    },
}));
