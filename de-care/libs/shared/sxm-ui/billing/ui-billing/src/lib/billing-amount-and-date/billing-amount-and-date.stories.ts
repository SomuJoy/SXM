import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiBillingBillingAmountAndDateModule } from './billing-amount-and-date.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BillingData } from '../interface';

const stories = storiesOf('Component Library/Billings/BillingAmountAndDate', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingAmountAndDateModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const billingData: BillingData = { amount: '15.16', date: '1/30/22' };
stories.add('default', () => ({
    template: `
        <sxm-ui-billing-amount-and-date [data]="data"></sxm-ui-billing-amount-and-date>
    `,
    props: { data: billingData },
}));

stories.add('past due', () => ({
    template: `
        <sxm-ui-billing-amount-and-date [data]="data"></sxm-ui-billing-amount-and-date>
    `,
    props: { data: { ...billingData, isPastDue: true, date: null } },
}));

stories.add('no date', () => ({
    template: `
        <sxm-ui-billing-amount-and-date [data]="data"></sxm-ui-billing-amount-and-date>
    `,
    props: { data: { ...billingData, date: null } },
}));

stories.add('billing-amount-and-date without input', () => ({
    template: `
        <sxm-ui-billing-amount-and-date [data]="data"></sxm-ui-billing-amount-and-date>
    `,
    props: { data: null },
}));
