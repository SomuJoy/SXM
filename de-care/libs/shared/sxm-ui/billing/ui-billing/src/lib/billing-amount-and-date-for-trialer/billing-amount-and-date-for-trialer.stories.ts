import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { BillingData } from '../interface';
import { SharedSxmUiBillingBillingAmountAndDateForTrialerModule } from './billing-amount-and-date-for-trialer.component';

const stories = storiesOf('Component Library/Billings/BillingAmountAndDateForTrialer', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingAmountAndDateForTrialerModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const billingData: BillingData = { date: '1/30/23' };
stories.add('default', () => ({
    template: `
        <sxm-ui-billing-amount-and-date-for-trialer [data]="data"></sxm-ui-billing-amount-and-date-for-trialer>
    `,
    props: { data: billingData },
}));

