import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SxmUiVerifyAddressComponent, SxmUiVerifyAddressComponentModule } from './verify-address.component';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { TRANSLATION_SETTINGS } from '@de-care/shared/configuration-tokens-locales';
import { action } from '@storybook/addon-actions';

type StoryType = SxmUiVerifyAddressComponent;

export default {
    title: 'Component Library/UI/VerifyAddressComponent',
    component: SxmUiVerifyAddressComponent,
    decorators: [
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SxmUiVerifyAddressComponentModule],
            providers: [...TRANSLATE_PROVIDERS, { provide: TRANSLATION_SETTINGS, useValue: { canToggleLanguage: true, languagesSupported: ['en-US', 'en-CA', 'fr-CA'] } }],
        }),
        withTranslation,
    ],
} as Meta<SxmUiVerifyAddressComponent>;

const oneCorrectedAddressData = {
    correctedAddresses: [{ addressLine1: '1902 North Carriage Lane', addressLine2: '', city: 'Kingston', state: 'PA', zip: '18704' }],
    currentAddress: { addressLine1: '1902 South Carriage Lane', city: 'Kingston', state: 'PA', zip: '18704' },
    headingText: '',
    addressCorrectionAction: 0,
};

const twoCorrectedAddressData = {
    correctedAddresses: [
        { addressLine1: '1902 North Carriage Lane', addressLine2: '', city: 'Kingston', state: 'PA', zip: '18704' },
        { addressLine1: '192 South Carriage Rd', addressLine2: '', city: 'Kingston', state: 'PA', zip: '18704' },
    ],
    currentAddress: { addressLine1: '1902 South Carriage Lane', city: 'Kingston', state: 'PA', zip: '18704' },
    headingText: '',
    addressCorrectionAction: 0,
};

const noCorrectedAddressData = {
    correctedAddresses: [],
    currentAddress: { addressLine1: '1902 South Carriage Lane', city: 'Kingston', state: 'PA', zip: '18704' },
    headingText: '',
    addressCorrectionAction: 2,
};

export const Default: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, data: oneCorrectedAddressData, onEditExisting: action('@Output() editExisting'), onUseCorrectedAddress: action('@Output() useAddress') },
    template: `<sxm-ui-verify-address [data]="data" (editExisting)="onEditExisting()" (useAddress)="onUseCorrectedAddress($event)"></sxm-ui-verify-address>`,
});

export const TwoCorrectedAddresses: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, data: twoCorrectedAddressData, onEditExisting: action('@Output() editExisting'), onUseCorrectedAddress: action('@Output() useAddress') },
    template: `<sxm-ui-verify-address [data]="data" (editExisting)="onEditExisting()" (useAddress)="onUseCorrectedAddress($event)"></sxm-ui-verify-address>`,
});

export const NoCorrectedAddresses: Story<StoryType> = (args: StoryType) => ({
    props: { ...args, data: noCorrectedAddressData, onEditExisting: action('@Output() editExisting'), onUseCorrectedAddress: action('@Output() useAddress') },
    template: `<sxm-ui-verify-address [data]="data" (editExisting)="onEditExisting()" (useAddress)="onUseCorrectedAddress($event)"></sxm-ui-verify-address>`,
});
