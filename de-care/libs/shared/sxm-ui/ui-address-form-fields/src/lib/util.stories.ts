import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { MOCK_DATA_LAYER_PROVIDER, MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiAddressFormFieldsModule } from './shared-sxm-ui-ui-address-form-fields.module';
import { AppSettings } from '@de-care/settings';

export const ADDRESS_FORM_FIELD_PROVIDERS = [
    { provide: AppSettings, useValue: { country: 'us' } },
    MOCK_DATA_LAYER_PROVIDER,
    MOCK_NGRX_STORE_PROVIDER,
    ...TRANSLATE_PROVIDERS,
];

export const stories = storiesOf('Component Library/Forms/Groups/AddressFormFields', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiAddressFormFieldsModule, ReactiveFormsModule],
            providers: ADDRESS_FORM_FIELD_PROVIDERS,
        })
    );
