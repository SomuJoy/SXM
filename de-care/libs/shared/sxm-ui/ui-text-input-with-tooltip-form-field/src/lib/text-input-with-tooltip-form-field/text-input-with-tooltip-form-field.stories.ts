import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiTextInputWithTooltipFormFieldModule } from '../shared-sxm-ui-ui-text-input-with-tooltip-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/TextFormFieldWithToolTip', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [FormsModule, ReactiveFormsModule, SharedSxmUiUiTextInputWithTooltipFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit(form.value.text)">
            <sxm-ui-text-input-with-tooltip-form-field formControlName="text" labelText="Text">
                <div htmlContentForTooltip>
                    text field tooltip
                </div>
            </sxm-ui-text-input-with-tooltip-form-field>
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
        form: new FormGroup({ text: new FormControl() }),
        onSubmit: action(`Input filled out`),
    },
}));

stories.add('required', () => ({
    template: `
        <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit(form.value.text)">
            <sxm-ui-text-input-with-tooltip-form-field
                formControlName="text"
                labelText="Text"
                errorText="Text is required"
            >
                <div htmlContentForTooltip>
                    text field tooltip
                </div>
            </sxm-ui-text-input-with-tooltip-form-field>
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
        form: new FormGroup({ text: new FormControl(null, Validators.required) }),
        onSubmit: action(`Input filled out`),
    },
}));

stories.add('icon only', () => ({
    template: `
        <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit(form.value.text)">
            <sxm-ui-text-input-with-tooltip-form-field formControlName="text" labelText="Text" [tooltipIconOnly]="true" (tooltipClicked)="onTooltipClick()" tooltipAriaLabelText="Click to learn more">
            </sxm-ui-text-input-with-tooltip-form-field>
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
        form: new FormGroup({ text: new FormControl() }),
        onTooltipClick: action('Tooltip clicked'),
        onSubmit: action(`Input filled out`),
    },
}));
