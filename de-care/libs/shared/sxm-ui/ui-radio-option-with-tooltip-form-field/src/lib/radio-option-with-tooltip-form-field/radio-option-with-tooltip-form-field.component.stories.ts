import { SharedSxmUiUiTooltipModule } from '@de-care/shared/sxm-ui/ui-tooltip';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiRadioOptionWithTooltipFormFieldModule } from '../shared-sxm-ui-ui-radio-option-with-tooltip-form-field.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionWithTooltipFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionWithTooltipFormFieldModule, SharedSxmUiUiTooltipModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <sxm-ui-radio-option-with-tooltip-form-field formControlName="option" label="Use email" value="email">
                <div htmlContentForTooltip>
                    email tooltip
                </div>
            </sxm-ui-radio-option-with-tooltip-form-field>
            <sxm-ui-radio-option-with-tooltip-form-field formControlName="option" label="Use phone" value="phone">
                <div htmlContentForTooltip>
                    phone tooltip
                </div>
            </sxm-ui-radio-option-with-tooltip-form-field>
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
        form: new FormGroup({ option: new FormControl() }),
        onSubmit: action(`Radio option selected`),
    },
}));
