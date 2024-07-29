import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiTextFormFieldModule } from '../shared-sxm-ui-ui-text-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/TextFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiTextFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.firstName)">
            <sxm-ui-text-form-field formControlName="firstName" labelText="First Name" ></sxm-ui-text-form-field>
            <br />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [
        `
        button { all: revert; }
    `,
    ],
    props: {
        form: new FormGroup({ firstName: new FormControl() }),
        onSubmit: action(`Input filled out`),
    },
}));

stories.add('required', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.firstName)">
            <sxm-ui-text-form-field
                formControlName="firstName"
                labelText="First Name"
                errorMsg="First name is required" >
            </sxm-ui-text-form-field>
            <br />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [
        `
        button { all: revert; }
    `,
    ],
    props: {
        form: new FormGroup({ firstName: new FormControl('', Validators.required) }),
        onSubmit: action(`Input filled out`),
    },
}));
