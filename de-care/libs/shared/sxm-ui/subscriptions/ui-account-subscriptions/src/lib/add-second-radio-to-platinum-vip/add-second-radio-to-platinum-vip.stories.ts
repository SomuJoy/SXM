import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiModalModule } from '@de-care/shared/sxm-ui/ui-modal';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumVipModule } from './add-second-radio-to-platinum-vip.component';

const stories = storiesOf('Component Library/Subscriptions/AddSecondRadio', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiSubscriptionsUiAddSecondRadioToPlatinumVipModule],
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
    template: `<sxm-ui-add-second-radio-to-platinum-vip (addSecondRadio)="addSecondRadio()"></sxm-ui-add-second-radio-to-platinum-vip>`,
    moduleMetadata: {
        providers: [],
    },
    props: {
        addSecondRadio: action('@Output() addSecondRadio'),
    },
}));

stories.add('add-a-second-radio: in modal', () => ({
    template: `
        <sxm-ui-modal [closed]="false" title="Dashboard" [titlePresent]="true" [showBackButton]="true">
            <sxm-ui-add-second-radio-to-platinum-vip (addSecondRadio)="addSecondRadio()"></sxm-ui-add-second-radio-to-platinum-vip>
        </sxm-ui-modal>
    `,
    moduleMetadata: {
        imports: [SharedSxmUiUiModalModule],
        providers: [],
    },
    props: {
        addSecondRadio: action('@Output() addSecondRadio'),
    },
}));
