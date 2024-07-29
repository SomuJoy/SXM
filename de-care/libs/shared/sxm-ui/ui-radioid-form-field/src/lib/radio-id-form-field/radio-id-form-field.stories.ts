import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiRadioidFormFieldModule } from '../shared-sxm-ui-ui-radioid-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/RadioIdFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioidFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

function createForm() {
    return new FormGroup({ radioId: new FormControl('', Validators.required) });
}
function onFormSubmit(form: FormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
        action(`Input filled out`)(form.value.radioId);
    }
}

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-radio-id-form-field formControlName="radioId" ></sxm-ui-radio-id-form-field>
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
            <sxm-ui-radio-id-form-field formControlName="radioId" [labelText]="label" [errorMsg]="error" ></sxm-ui-radio-id-form-field>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
        label: 'Radio ID custom label',
        error: 'Custom error',
    },
}));
