import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPhoneNumberFormFieldModule } from '../shared-sxm-ui-ui-phone-number-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/PhoneNumberFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiPhoneNumberFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withMockSettings);

function createForm() {
    return new FormGroup({ phoneNumber: new FormControl('', Validators.required) });
}
function onFormSubmit(form: FormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
        action(`Input filled out`)(form.value.phoneNumber);
    }
}

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-phone-number-form-field formControlName="phoneNumber"></sxm-ui-phone-number-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
    },
}));

stories.add('with custom label and error message', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-phone-number-form-field formControlName="phoneNumber" [labelText]="label" [errorMsg]="error" ></sxm-ui-phone-number-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
        label: 'Phone Number custom label',
        error: 'Custom error',
    },
}));
