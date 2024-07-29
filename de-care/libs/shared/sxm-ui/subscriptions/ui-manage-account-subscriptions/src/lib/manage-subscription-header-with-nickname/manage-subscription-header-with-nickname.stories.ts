import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiManageSubscriptionHeaderWithNicknameModule } from './manage-subscription-header-with-nickname.component';

const stories = storiesOf('Component Library/Subscriptions/ManageSubscriptionHeaderWithNickname', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiManageSubscriptionHeaderWithNicknameModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        })
    )
    .addDecorator(withTranslation);

const mockData = {
    nickname: "Pen's car",
    radioId: '1234567890',
    platform: 'SiriusXM',
    yearMakeModelInfo: '2019 Volkswagen Jetta',
    vehicleType: 'CAR',
};

const aviationMockData = {
    nickname: "Pen's car",
    radioId: '1234567890',
    platform: 'SiriusXM',
    yearMakeModelInfo: '2019 Volkswagen Jetta',
    vehicleType: 'AVIATION',
};

const marineMockData = {
    nickname: "Pen's car",
    radioId: '1234567890',
    platform: 'SiriusXM',
    yearMakeModelInfo: '2019 Volkswagen Jetta',
    vehicleType: 'MARINE',
};

stories.add('default', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-nickname [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header-with-nickname>
    `,
    props: {
        data: mockData,
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));

stories.add('With Aviation Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-nickname [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header-with-nickname>
    `,
    props: {
        data: aviationMockData,
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));

stories.add('With Marine Icon', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-nickname [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header-with-nickname>
    `,
    props: {
        data: marineMockData,
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));

stories.add('with 360L radio', () => ({
    template: `
        <sxm-ui-manage-subscription-header-with-nickname [data]="data" (back)="back()" (editNickname)="editNickname()"></sxm-ui-manage-subscription-header-with-nickname>
    `,
    props: {
        data: { ...mockData, is360L: true },
        back: action('back clicked'),
        editNickname: action('edit nickname clicked'),
    },
}));
