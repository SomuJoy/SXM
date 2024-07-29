import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiBillingBillingFooterModule } from './billing-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Billings/BillingFooter', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingFooterModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const billingData = { lastAmount: '$15.00', lastDate: '2022-10-03', daysSinceLastPayment: 4 };
stories.add('default', () => ({
    template: `
        <sxm-ui-billing-footer [data]="data">
        </sxm-ui-billing-footer>
    `,
    props: { data: billingData },
}));

const billingData2 = { lastAmount: '15.00', lastDate: '2022-10-03', daysSinceLastPayment: 0 };
stories.add('last paid today', () => ({
    template: `
        <sxm-ui-billing-footer [data]="data">
        </sxm-ui-billing-footer>
    `,
    props: { data: billingData2 },
}));
