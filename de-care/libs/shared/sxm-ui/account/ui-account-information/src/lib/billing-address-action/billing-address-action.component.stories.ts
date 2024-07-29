import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { Address, SxmUiBillingAddressActionComponent, SharedSxmUiBillingAddressActionComponentModule } from './billing-address-action.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiBillingAddressActionComponent;

export default {
    title: 'Component Library/Account/BillingAddressActionComponent',
    component: SxmUiBillingAddressActionComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiBillingAddressActionComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiBillingAddressActionComponent>;

const addressData: Address = {
    addressLine1: '28 Liberty St',
    city: 'New York',
    state: 'NY',
    zip: '10005',
};

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, addressData, onEditBillingAddress: action('edit billing address') },
    template: `<sxm-ui-billing-address-action [address]="addressData" (editBillingAddress)="onEditBillingAddress()"></sxm-ui-billing-address-action>`,
});
