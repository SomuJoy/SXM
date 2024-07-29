import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { SharedSxmUiEditLoginUsernamePasswordModule } from './edit-login-username-password.component';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Full Forms/EditAccountLoginUsernamePassword', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiEditLoginUsernamePasswordModule],
            providers: [
                ...TRANSLATE_PROVIDERS,
                MOCK_NGRX_STORE_PROVIDER,
                { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } },
            ],
        })
    )
    .addDecorator(withTranslation);

const username = 'testusername@siriusxm.com';

stories.add('default', () => ({
    template: `
        <sxm-ui-edit-login-username-password [username]="username" (formCompleted)="onFormCompleted($event)" (cancel)="onCancel()"></sxm-ui-edit-login-username-password>
    `,
    props: {
        username: username,
        onFormCompleted: action('submit clicked'),
        onCancel: action('cancel clicked'),
    },
}));
