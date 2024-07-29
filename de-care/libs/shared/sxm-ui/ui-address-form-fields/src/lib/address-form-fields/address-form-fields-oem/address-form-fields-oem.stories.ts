import { AddressFormFieldsOemComponent } from './address-form-fields-oem.component';
import { boolean } from '@storybook/addon-knobs';
import { ReactiveFormsModule } from '@angular/forms';
import { stories } from '../../util.stories';

stories.add('address-form-fields: OEM', () => ({
    component: AddressFormFieldsOemComponent,
    moduleMetadata: { imports: [ReactiveFormsModule] },
    props: {
        submitted: boolean('@Input submitted', false)
    }
}));
