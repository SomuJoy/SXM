import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule } from './billing-with-trialer-no-payment-due.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BillingData } from '../interface';

const stories = storiesOf('Component Library/Billings/BillingWithTrialerNoPaymentDue', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingWithTrialerNoPaymentDueModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const billingData: BillingData = { date: '1/30/22' };

stories.add('default', () => ({
    template: `
        <sxm-ui-billing-with-trialer-no-payment-due [data]="data"></sxm-ui-billing-with-trialer-no-payment-due>
    `,
    props: { data: billingData },
}));
