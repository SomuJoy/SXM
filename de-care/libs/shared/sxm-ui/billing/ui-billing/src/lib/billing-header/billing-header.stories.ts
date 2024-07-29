import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiBillingBillingHeaderModule } from './billing-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Billings/BillingHeader', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingBillingHeaderModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <sxm-ui-billing-header title="Your payment is past due.">
        </sxm-ui-billing-header>
    `,
    props: {},
}));

stories.add('with wrapped title', () => ({
    template: `
        <sxm-ui-billing-header title="Your payment is past due. Your payment is past due. Your payment is past due. Your payment is past due.">
        </sxm-ui-billing-header>
    `,
    props: {},
}));

stories.add('with warning', () => ({
    template: `
        <sxm-ui-billing-header title="Your payment is past due." warning="Make a payment to reactivate your subscription(s).">
        </sxm-ui-billing-header>
    `,
    props: {},
}));

stories.add('host-context(.no-icon)', () => ({
    template: `
        <div class="no-icon" >
            <sxm-ui-billing-header title="Your payment is past due.">
            </sxm-ui-billing-header>
        </div>
    `,
    props: {},
}));
