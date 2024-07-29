import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS, TRANSLATE_PROVIDERS_CA } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPostalCodeFormFieldModule } from '../shared-sxm-ui-ui-postal-code-form-field.module';
import { SettingsService } from '@de-care/settings';

const stories = storiesOf('Component Library/Forms/Fields/PostalCodeFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiPostalCodeFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

function createForm() {
    return new FormGroup({ zipCode: new FormControl('', Validators.required) });
}
function onFormSubmit(form: FormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
        action(`Input filled out`)(form.value.zipCode);
    }
}

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-postal-code-form-field formControlName="zipCode" ></sxm-ui-postal-code-form-field>
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
            <sxm-ui-postal-code-form-field formControlName="zipCode" [labelText]="label" [errorMsg]="error" ></sxm-ui-postal-code-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
        label: 'Zip Code custom label',
        error: 'Custom error',
    },
}));

stories.add('in Canada', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-postal-code-form-field formControlName="zipCode" [isCanada]="true"></sxm-ui-postal-code-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    moduleMetadata: {
        providers: [...TRANSLATE_PROVIDERS_CA, { provide: SettingsService, useValue: { isCanadaMode: true } }],
    },
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
    },
}));
