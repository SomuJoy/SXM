import { withCommonDependencies } from '@de-care/shared/storybook/util-helpers';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiNumericalInputWithTooltipFormFieldModule } from '../shared-sxm-ui-ui-numerical-input-with-tooltip-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/NumericalFormFieldWithToolTip', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [FormsModule, ReactiveFormsModule, SharedSxmUiUiNumericalInputWithTooltipFormFieldModule],
        })
    )
    .addDecorator(withCommonDependencies);

stories.add('default', () => ({
    template: `
        <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit(form.value.number)">
            <sxm-ui-numerical-input-with-tooltip-form-field formControlName="number" labelText="Number">
                <div htmlContentForTooltip>
                    number tooltip
                </div>
            </sxm-ui-numerical-input-with-tooltip-form-field>
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
        form: new FormGroup({ number: new FormControl() }),
        onSubmit: action(`Input filled out`),
    },
}));

stories.add('required', () => ({
    template: `
        <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit(form.value.number)">
            <sxm-ui-numerical-input-with-tooltip-form-field
                formControlName="number"
                labelText="Number"
                errorText="Number is required"
            >
                <div htmlContentForTooltip>
                    number tooltip
                </div>
            </sxm-ui-numerical-input-with-tooltip-form-field>
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
        form: new FormGroup({ number: new FormControl(null, Validators.required) }),
        onSubmit: action(`Input filled out`),
    },
}));
