import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedSxmUiUiPasswordFormFieldModule } from '../shared-sxm-ui-ui-password-form-field.module';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';

const stories = storiesOf('Component Library/Forms/Fields/PasswordFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiPasswordFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

function createForm() {
    return new FormGroup({ password: new FormControl('', Validators.required) });
}
function onFormSubmit(form: FormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
        action(`Input filled out`)(form.value.password);
    }
}

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-password-form-field formControlName="password" ></sxm-ui-password-form-field>
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
            <sxm-ui-password-form-field formControlName="password" [labelText]="label" [errorMsg]="error" ></sxm-ui-password-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
        label: 'Password custom label',
        error: 'Custom error',
    },
}));
