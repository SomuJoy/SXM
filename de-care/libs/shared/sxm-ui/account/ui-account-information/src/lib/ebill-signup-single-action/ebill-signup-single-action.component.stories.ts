import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiEBillSignupSingleActionComponent, SharedSxmUiEBillSignupSingleActionComponentModule } from './ebill-signup-single-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiEBillSignupSingleActionComponent;

export default {
    title: 'Component Library/Account/EBillSignupSingleActionComponent',
    component: SxmUiEBillSignupSingleActionComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiEBillSignupSingleActionComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiEBillSignupSingleActionComponent>;

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, onSignUpEBill: action('sign up for eBill') },
    template: `<sxm-ui-ebill-signup-single-action (signUpEBill)="onSignUpEBill()"></sxm-ui-ebill-signup-single-action>`,
});
