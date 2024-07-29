import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiBillingBillingWithAutomatedPaymentModule } from './billing-with-automated-payment.component';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BillingData } from '../interface';

const stories = storiesOf('Component Library/Billings/BillingWithAutomatedPayment', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingWithAutomatedPaymentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const billingData: BillingData = { daysDue: 20, amount: '$15.16', date: '1/30/22', lastAmount: '$15.00', lastDate: '12/22/2021' };
stories.add('default', () => ({
    template: `
    <sxm-ui-billing-with-automated-payment [showWarning]="showWarning" [allowPaymentUpdate]="allowPaymentUpdate" [data]="data"></sxm-ui-billing-with-automated-payment>
`,
    props: { data: billingData, showWarning: false, allowPaymentUpdate: false },
}));

const billingData3: BillingData = { daysDue: 0, amount: '$15.16', date: '1/30/22', lastAmount: '$15.00', lastDate: '12/22/2021' };
stories.add('today', () => ({
    template: `
    <sxm-ui-billing-with-automated-payment [showWarning]="showWarning" [allowPaymentUpdate]="allowPaymentUpdate" [data]="data"></sxm-ui-billing-with-automated-payment>
`,
    props: { data: billingData3, showWarning: false, allowPaymentUpdate: false },
}));

const billingData4: BillingData = { daysDue: 1, amount: '$15.16', date: '1/30/22' };
stories.add('future payment, 1 day', () => ({
    template: `
    <sxm-ui-billing-with-automated-payment [showWarning]="showWarning" [allowPaymentUpdate]="allowPaymentUpdate" [data]="data"></sxm-ui-billing-with-automated-payment>
`,
    props: { data: billingData4, showWarning: false, allowPaymentUpdate: false },
}));

const billingData5: BillingData = { daysDue: 1, amount: '$15.16', date: null };
stories.add('no due date', () => ({
    template: `
    <sxm-ui-billing-with-automated-payment [showWarning]="showWarning" [allowPaymentUpdate]="allowPaymentUpdate" [data]="data"></sxm-ui-billing-with-automated-payment>
`,
    props: { data: billingData5, showWarning: false, allowPaymentUpdate: false },
}));
