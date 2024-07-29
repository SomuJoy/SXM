import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiOneTimeCodeFormFieldModule } from '../shared-sxm-ui-ui-one-time-code-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/OneTimeCodeFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiOneTimeCodeFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.firstName)">
            <sxm-ui-one-time-code-form-field formControlName="oneTimeCode" labelText="One Time Code" ></sxm-ui-one-time-code-form-field>
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
        form: new FormGroup({ oneTimeCode: new FormControl() }),
        onSubmit: action(`Input filled out`),
    },
}));

stories.add('required', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.firstName)">
            <sxm-ui-one-time-code-form-field
                formControlName="oneTimeCode"
                labelText="One Time Code"
                errorMsg="One Time Code is required" >
            </sxm-ui-one-time-code-form-field>
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
        form: new FormGroup({ oneTimeCode: new FormControl('', Validators.required) }),
        onSubmit: action(`Input filled out`),
    },
}));
