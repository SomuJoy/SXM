import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiManageSubscriptionHeaderModule } from './manage-subscription-header.component';

const stories = storiesOf('Component Library/Subscriptions/ManageSubscriptionHeader', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiManageSubscriptionHeaderModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const mockData = {
    vehicleType: 'CAR',
    radioId: '1234567890',
    platform: 'SiriusXM',
};

const aviationMockData = {
    vehicleType: 'AVIATION',
    radioId: '1234567890',
    platform: 'Sirius',
};

const marineMockData = {
    vehicleType: 'MARINE',
    radioId: '1234567890',
    platform: 'XM',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-manage-subscription-header [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header>
    `,
    props: {
        data: mockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('With Aviation Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header>
    `,
    props: {
        data: aviationMockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('With Marine Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header>
    `,
    props: {
        data: marineMockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('with 360L radio', () => ({
    template: `
        <sxm-ui-manage-subscription-header [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header>
    `,
    props: {
        data: { ...mockData, is360L: true },
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));
