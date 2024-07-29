import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiUsStateDropdownFormFieldModule } from '../shared-sxm-ui-ui-us-state-dropdown-form-field.module';

const stories = storiesOf('Component Library/Forms/Fields/USStateDropdownFormFieldComponent', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiUsStateDropdownFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withTranslation);

const form = new FormGroup({ state: new FormControl(null, [Validators.required]) });

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form.value)">
            <sxm-ui-us-state-dropdown-form-field formControlName="state"></sxm-ui-us-state-dropdown-form-field>
            <button type="submit">Submit</button>
        </form>
    `,
    props: {
        form,
        onSubmit: (value) => {
            form.markAllAsTouched();
            if (form.valid) {
                action('Form data submitted')(value);
            }
        },
    },
}));
