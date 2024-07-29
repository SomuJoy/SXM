import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { SharedSxmUiUiRadioOptionAsBlockFormFieldModule } from '../shared-sxm-ui-ui-radio-option-as-block-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/RadioOptionAsBlockFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiRadioOptionAsBlockFormFieldModule],
        })
    );

stories.add('default', () => ({
    template: `
        <form  [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
            <div style = "column-gap:20px; display:grid; grid-template-columns: 180px 180px; padding:40px; justify-content: center">
                <sxm-ui-radio-option-as-block-form-field formControlName ="option" [labelCopy] = "options[1]" value="no"></sxm-ui-radio-option-as-block-form-field>
                <sxm-ui-radio-option-as-block-form-field formControlName ="option" [labelCopy] = "options[0]" value="yes"></sxm-ui-radio-option-as-block-form-field>
                <br />
            </div>
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
        options: [
            {
                title: 'No',
                description: 'Just add a new car',
            },
            {
                title: 'Yes',
                description: 'Replace an old car with my new car',
            },
        ],
    },
}));
