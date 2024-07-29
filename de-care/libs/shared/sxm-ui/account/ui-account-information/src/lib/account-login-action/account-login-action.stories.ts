import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiAccountLoginActionComponent, SharedSxmUiUiAccountLoginActionModule } from './account-login-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiAccountLoginActionComponent;

export default {
    title: 'Component Library/Account/AccountLoginActionComponent',
    component: SxmUiAccountLoginActionComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiAccountLoginActionModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiAccountLoginActionComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, username: 'tom.wambsgams@siriusxm.com', onEditAccountLogin: action('edit account login') },
    template: `<sxm-ui-account-login-action [username]="username" (editAccountLogin)="onEditAccountLogin()" ></sxm-ui-account-login-action>`,
});
