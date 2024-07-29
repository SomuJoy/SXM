import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule } from './billing-with-no-payment-due-automated.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Billings/BillingWithNoPaymentDueAutomated', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingWithNoPaymentDueAutomatedModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);
const billingData = { date: '3/30/22' };
stories.add('default', () => ({
    template: `
        <sxm-ui-billing-with-no-payment-due-automated [data]="data"></sxm-ui-billing-with-no-payment-due-automated>
    `,
    props: { data: billingData },
}));

stories.add('no date', () => ({
    template: `
        <sxm-ui-billing-with-no-payment-due-automated [data]="data"></sxm-ui-billing-with-no-payment-due-automated>
    `,
    props: { data: { date: null } },
}));
