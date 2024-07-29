import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule } from './seasonally-suspended-inactive-subscriptions.component';

const stories = storiesOf('Component Library/Subscriptions/SeasonallySuspendedInactiveSubscriptions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiSeasonallySuspendedInactiveModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

stories.add('Car', () => ({
    template: `
        <sxm-ui-seasonally-suspended-inactive-subscriptions
            [data]="data" (activateSuspendedDevice)="onActivateSuspendedDevice()"
            (cancelSuspendedDevice)="onCancelSuspendedDevice()">
        </sxm-ui-seasonally-suspended-inactive-subscriptions>
    `,
    props: {
        data: {
            vehicle: '2021 Honda Civic',
            radioId: '990005525221',
            vehicleType: 'CAR',
        },
        onActivateSuspendedDevice: action('Action Button Clicked'),
        onCancelSuspendedDevice: action('Cancel Button Clciked'),
    },
}));

stories.add('Nickname', () => ({
    template: `
        <sxm-ui-seasonally-suspended-inactive-subscriptions [data]="data" (activateSuspendedDevice)="onActivateSuspendedDevice()" (cancelSuspendedDevice)="onCancelSuspendedDevice()"></sxm-ui-seasonally-suspended-inactive-subscriptions>
    `,
    props: {
        data: {
            vehicle: `Mike's car`,
            radioId: '990005525221',
            username: 'geralt.rivia@gmail.com',
            vehicleType: 'CAR',
        },
        onActivateSuspendedDevice: action('Action Button Clicked'),
        onCancelSuspendedDevice: action('Cancel Button Clicked'),
    },
}));

stories.add('Aviation', () => ({
    template: `
        <sxm-ui-seasonally-suspended-inactive-subscriptions [data]="data" (activateSuspendedDevice)="onActivateSuspendedDevice()" (cancelSuspendedDevice)="onCancelSuspendedDevice()"></sxm-ui-seasonally-suspended-inactive-subscriptions>
    `,
    props: {
        data: {
            vehicle: '2020 Cessna 206',
            radioId: '990005525222',
            vehicleType: 'AVIATION',
        },
        onActive: action('activate clicked'),
        onRemoveDevice: action('remove device clicked'),
    },
}));

stories.add('Marine', () => ({
    template: `
        <sxm-ui-seasonally-suspended-inactive-subscriptions [data]="data" (activateSuspendedDevice)="onActivateSuspendedDevice()" (cancelSuspendedDevice)="onCancelSuspendedDevice()"></sxm-ui-seasonally-suspended-inactive-subscriptions>
    `,
    props: {
        data: {
            vehicle: 'MasterCraft X55 Boat',
            radioId: '990005525223',
            vehicleType: 'MARINE',
        },
        onActive: action('activate clicked'),
        onRemoveDevice: action('remove device clicked'),
    },
}));
