import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '../shared-sxm-ui-ui-credit-card-form-fields.module';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Credit Card/Expiration Date Form Field', module)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiCreditCardFormFieldsModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withKnobs)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm(form.value)">
            <sxm-ui-expiration-date-form-field formControlName="field"></sxm-ui-expiration-date-form-field>
            <button type="submit">SUBMIT</button>
        </form>
    `,
    props: {
        form: new FormGroup({ field: new FormControl() }),
        submitForm: action('submitForm()'),
    },
}));
