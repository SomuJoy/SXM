import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedSxmUiUiCheckboxWithLabelFormFieldModule } from '../shared-sxm-ui-ui-checkbox-with-label-form-field.module';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Fields/CheckboxWithLabelFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiCheckboxWithLabelFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.field)">
            <sxm-ui-checkbox-with-label-form-field formControlName="field">
                <p>Check to confirm</p>
            </sxm-ui-checkbox-with-label-form-field>
        </form>
    `,
    props: {
        form: new FormGroup({ field: new FormControl() }),
        onSubmit: action(`Checkbox checked status`),
    },
}));

stories.add('in form with submit and reset buttons and validation', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.field)">
            <sxm-ui-checkbox-with-label-form-field formControlName="field">
                <p>Check to confirm</p>
            </sxm-ui-checkbox-with-label-form-field>
            <div *ngIf="form.get('field').errors">
                Confirmation is required
            </div>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: ['button { all: revert; }'],
    props: {
        form: new FormGroup({ field: new FormControl(null, Validators.requiredTrue) }),
        onSubmit: action(`Checkbox checked status`),
    },
}));

const longText =
    'Please charge my credit card for the amount due now and recurring charges as outlined above.  By clicking “Complete My Order”, I agree that my service will AUTOMATICALLY RENEW and will be charged to my payment method at then-current rates at the time of each renewal, plus fees and taxes, until I cancel.';

stories.add('long text', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.field)">
            <sxm-ui-checkbox-with-label-form-field formControlName="field">
                <p>{{ longText }}</p>
            </sxm-ui-checkbox-with-label-form-field>
        </form>
    `,
    props: {
        longText,
        form: new FormGroup({ field: new FormControl() }),
    },
}));

stories.add('long text as small copy', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.field)">
            <sxm-ui-checkbox-with-label-form-field formControlName="field">
                <p class="small-copy">{{ longText }}</p>
            </sxm-ui-checkbox-with-label-form-field>
        </form>
    `,
    props: {
        longText,
        form: new FormGroup({ field: new FormControl() }),
    },
}));
