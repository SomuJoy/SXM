import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumTwoDeviceBundleModule } from './add-second-radio-to-platinum-two-device-bundle.component';

const stories = storiesOf('Component Library/Subscriptions/AddSecondRadioPlatinumBundle', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumTwoDeviceBundleModule],
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
    template: `<sxm-ui-add-second-radio-to-platinum-two-device-bundle></sxm-ui-add-second-radio-to-platinum-two-device-bundle>`,
    moduleMetadata: {
        providers: [],
    },
    props: {},
}));

stories.add('add-a-second-radio: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Dashboard" [titlePresent]="true">
            <sxm-ui-add-second-radio-to-platinum-two-device-bundle></sxm-ui-add-second-radio-to-platinum-two-device-bundle>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {},
}));
