import { moduleMetadata, storiesOf } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '../shared-sxm-ui-ui-credit-card-form-fields.module';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Credit Card/Name On Card Form Field', module)
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
            <sxm-ui-name-on-card-form-field formControlName="field"></sxm-ui-name-on-card-form-field>
            <button type="submit">SUBMIT</button>
        </form>
    `,
    props: {
        form: new FormGroup({ field: new FormControl() }),
        submitForm: action('submitForm()'),
    },
}));
