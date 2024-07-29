import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiBillingEbillOptOutComponentModule } from './billing-ebill-opt-out.component';

const stories = storiesOf('Component Library/Billings/BillingEbillOptOut', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiBillingEbillOptOutComponentModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                {
                    provide: TRANSLATION_SETTINGS,
                    useValue: {
                        canToggleLanguage: true,
                        languagesSupported: ['en-US', 'en-CA', 'fr-CA'],
                    },
                },
            ],
        })
    )
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);


stories.add('default', () => ({
    template: `
    <sxm-ui-billing-ebill-opt-out [loading]="false" [switchToPaperServerError]="false" (switchToPaper)="onSwitchToPaper()" (keepEBill)="onKeepEBill()"></sxm-ui-billing-ebill-opt-out>
    `,
    moduleMetadata: {
        providers: [],
    },
    props: {
        onKeepEBill: action('@Output() onKeepEBill'),
        onSwitchToPaper: action('@Output() onSwitchToPaper'),
    },
}));

stories.add('opt-out: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Billing" [titlePresent]="true">
        <sxm-ui-billing-ebill-opt-out [loading]="false" [switchToPaperServerError]="false" (switchToPaper)="onSwitchToPaper()" (keepEBill)="onKeepEBill()"></sxm-ui-billing-ebill-opt-out>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        onKeepEBill: action('@Output() onKeepEBill'),
        onSwitchToPaper: action('@Output() onSwitchToPaper'),
    },
}));
