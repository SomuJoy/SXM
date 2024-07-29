import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ContactInfo, SxmUiContactInfoActionComponent, SharedSxmUiContactInfoActionComponentModule } from './contact-info-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiContactInfoActionComponent;

export default {
    title: 'Component Library/Account/ContactInfoActionComponent',
    component: SxmUiContactInfoActionComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiContactInfoActionComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiContactInfoActionComponent>;

const contactInfoData: ContactInfo = {
    name: 'Logan Roy',
    phone: '2122222222',
    email: 'logan.roy@siriusxm.com',
    address: {
        addressLine1: '28 Liberty St',
        city: 'New York',
        state: 'NY',
        zip: '10005',
    },
};

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, contactInfoData, onEditContactInfo: action('edit contact info') },
    template: `<sxm-ui-contact-info-action [data]="contactInfoData" (editContactInfo)="onEditContactInfo()"></sxm-ui-contact-info-action>`,
});

export const NoAddress: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, contactInfoData: { ...contactInfoData, address: null }, onEditContactInfo: action('edit contact info') },
    template: `<sxm-ui-contact-info-action [data]="contactInfoData" (editContactInfo)="onEditContactInfo()"></sxm-ui-contact-info-action>`,
});
