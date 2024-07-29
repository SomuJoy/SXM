import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiManageSubscriptionHeaderWithRadioIdModule } from './manage-subscription-header-with-radio-id.component';

const stories = storiesOf('Component Library/Subscriptions/ManageSubscriptionHeaderWithRadioId', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiManageSubscriptionHeaderWithRadioIdModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const mockData = {
    radioId: '1234567890',
    platform: 'SiriusXM',
    vehicleType: 'CAR',
};

const aviationMockData = {
    radioId: '1234567890',
    platform: 'Sirius',
    vehicleType: 'AVIATION',
};

const marineMockData = {
    radioId: '1234567890',
    platform: 'XM',
    vehicleType: 'MARINE',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-radio-id [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header-with-radio-id>
    `,
    props: {
        data: mockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('With Aviation Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-radio-id [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header-with-radio-id>
    `,
    props: {
        data: aviationMockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('With Marine Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-radio-id [data]="data" (back)="back()" (addNickname)="addNickname()"></sxm-ui-manage-subscription-header-with-radio-id>
    `,
    props: {
        data: marineMockData,
        back: action('back clicked'),
        addNickname: action('add nickname clicked'),
    },
}));

stories.add('with 360L radio', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-radio-id [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header-with-radio-id>
    `,
    props: {
        data: { ...mockData, is360L: true },
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));
