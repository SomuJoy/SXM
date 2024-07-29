import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiEmailFormFieldModule } from '../shared-sxm-ui-ui-email-form-field.module';
import { getSxmValidator } from '@de-care/shared/validation';

const stories = storiesOf('Component Library/Forms/Fields/EmailFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiEmailFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withMockSettings);

stories.add('default', () => ({
    template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit(form.value.option)">
        <sxm-ui-email-form-field
            formControlName="emailInput"
            [controlId]="emailInputId"
            onFocus
        >
        </sxm-ui-email-form-field>

    </form>
    `,

    props: {
        form: new FormGroup({ emailInput: new FormControl(null, getSxmValidator('email', 'us', 'en-US')) }),
        onSubmit: action(`Email entered`),
    },
}));
