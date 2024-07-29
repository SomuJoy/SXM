import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule } from './seasonally-suspended-streaming-inactive-subscriptions.component';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/SeasonallySuspendedStreamingInactiveSubscriptions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiSeasonallySuspendedStreamingInactiveModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

stories.add('Default', () => ({
    template: `
        <sxm-ui-seasonally-suspended-streaming-inactive-subscriptions (activateSuspendedDevice)="onActivateSuspendedDevice()" (cancelSuspendedDevice)="oncancelSuspendedDevice()"></sxm-ui-seasonally-suspended-streaming-inactive-subscriptions>
    `,
    props: {
        onActivateSuspendedDevice: action('Activate clicked'),
        oncancelSuspendedDevice: action('Cancel clicked'),
    },
}));
