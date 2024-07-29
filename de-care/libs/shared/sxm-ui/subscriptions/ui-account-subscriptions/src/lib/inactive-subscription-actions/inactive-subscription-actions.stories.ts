import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule } from '../inactive-subscription-actions/inactive-subscription-actions.component';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';

const stories = storiesOf('Component Library/Subscriptions/InactiveSubscriptionActions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiSubscriptionsUiInactiveSubscriptionActionsModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
                MOCK_NGRX_STORE_PROVIDER,
            ],
        })
    )
    .addDecorator(withTranslation);

stories.add('Car', () => ({
    template: `
        <sxm-ui-inactive-subscription-actions [data]="data" (activate)="onActive()" (removeDevice)="onRemoveDevice()"></sxm-ui-inactive-subscription-actions>
    `,
    props: {
        data: {
            vehicle: '2021 Honda Civic',
            radioId: '990005525221',
            vehicleType: 'CAR',
        },
        onActive: action('activate clicked'),
        onRemoveDevice: action('remove device clicked'),
    },
}));

stories.add('Nickname', () => ({
    template: `
        <sxm-ui-inactive-subscription-actions [data]="data" (activate)="onActive()" (removeDevice)="onRemoveDevice()"></sxm-ui-inactive-subscription-actions>
    `,
    props: {
        data: {
            vehicle: `Mike's car`,
            radioId: '990005525221',
            username: 'geralt.rivia@gmail.com',
            vehicleType: 'CAR',
        },
        onActive: action('activate clicked'),
        onRemoveDevice: action('remove device clicked'),
    },
}));

stories.add('Aviation', () => ({
    template: `
        <sxm-ui-inactive-subscription-actions [data]="data" (activate)="onActive()" (removeDevice)="onRemoveDevice()"></sxm-ui-inactive-subscription-actions>
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
        <sxm-ui-inactive-subscription-actions [data]="data" (activate)="onActive()" (removeDevice)="onRemoveDevice()"></sxm-ui-inactive-subscription-actions>
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

stories.add('Nonpay', () => ({
    template: `
        <sxm-ui-inactive-subscription-actions [data]="data" (activate)="onActive()" (removeDevice)="onRemoveDevice()"></sxm-ui-inactive-subscription-actions>
    `,
    props: {
        data: {
            vehicle: `Mike's car`,
            radioId: '990005525221',
            username: 'geralt.rivia@gmail.com',
            isInactiveDueToNonPay: true,
            vehicleType: 'CAR',
        },
        onActive: action('activate clicked'),
        onRemoveDevice: action('remove device clicked'),
    },
}));
