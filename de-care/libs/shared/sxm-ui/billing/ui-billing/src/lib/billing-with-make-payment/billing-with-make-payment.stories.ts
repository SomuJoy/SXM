import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiBillingBillingWithMakePaymentModule } from './billing-with-make-payment.component';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BillingData } from '../interface';

const stories = storiesOf('Component Library/Billings/BillingWithMakePayment', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingWithMakePaymentModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        })
    )
    .addDecorator(withTranslation);

const billingData: BillingData = { amount: '$15.16', date: '1/30/22', daysDue: 0, lastAmount: '$15.00', lastDate: '12/22/2021' };
stories.add('default', () => ({
    template: `
    <sxm-ui-billing-with-make-payment [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { showWarning: false, data: billingData, onMakePayment: action(`Make a payment clicked`) },
}));

const billingData2: BillingData = { amount: '$15.16', date: '1/30/22', daysDue: 20, lastAmount: '$15.00', lastDate: '12/22/2021' };
stories.add('future payment', () => ({
    template: `
    <sxm-ui-billing-with-make-payment [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { data: billingData2, showWarning: false, onMakePayment: action(`Make a payment clicked`) },
}));

const billingData3: BillingData = { amount: '$15.16', date: '1/30/22', daysDue: 1 };
stories.add('future payment, 1 day', () => ({
    template: `
    <sxm-ui-billing-with-make-payment [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { data: billingData3, showWarning: false, onMakePayment: action(`Make a payment clicked`) },
}));

const billingData4: BillingData = { amount: '$15.16', date: null, daysDue: null, lastAmount: '$15.00', lastDate: '12/22/2021' };
stories.add('no due date', () => ({
    template: `
    <sxm-ui-billing-with-make-payment [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { data: billingData4, showWarning: false, onMakePayment: action(`Make a payment clicked`) },
}));

const billingData5: BillingData = { amount: '$15.16', date: '1/30/22', daysDue: -1, isPastDue: true, lastAmount: null, lastDate: null };
stories.add('past due', () => ({
    template: `
    <sxm-ui-billing-with-make-payment [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { data: billingData5, showWarning: true, onMakePayment: action(`Make a payment clicked`) },
}));

stories.add('host-context(.button-right)', () => ({
    template: `
    <sxm-ui-billing-with-make-payment class="button-right" [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { showWarning: false, data: billingData, onMakePayment: action(`Make a payment clicked`) },
}));

stories.add('host-context(.button-right .no-icon)', () => ({
    template: `
    <sxm-ui-billing-with-make-payment class="button-right no-icon" [showWarning]="showWarning" [data]="data" (makePayment)="onMakePayment()"></sxm-ui-billing-with-make-payment>
`,
    props: { showWarning: false, data: billingData, onMakePayment: action(`Make a payment clicked`) },
}));
