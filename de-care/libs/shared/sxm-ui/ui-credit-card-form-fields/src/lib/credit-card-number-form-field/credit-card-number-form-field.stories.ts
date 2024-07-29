import { moduleMetadata, storiesOf } from '@storybook/angular';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '../shared-sxm-ui-ui-credit-card-form-fields.module';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { CREDIT_CARD_TYPE_IDENTIFIER } from '../tokens';

const stories = storiesOf('Component Library/Forms/Credit Card/Credit Card Number Form Field', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiCreditCardFormFieldsModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withTranslation);

const mockForm = new FormGroup({ field: new FormControl() });
const commonProps = {
    form: mockForm,
    submitForm: action('submitForm()'),
};

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm(form.value)">
            <sxm-ui-credit-card-number-form-field formControlName="field"></sxm-ui-credit-card-number-form-field>
            <button type="submit">SUBMIT</button>
        </form>
    `,
    props: {
        ...commonProps,
    },
}));

stories.add('with custom type identifier', () => ({
    moduleMetadata: {
        providers: [{ provide: CREDIT_CARD_TYPE_IDENTIFIER, useValue: { identifyType: (value) => (value?.startsWith('1') ? 'mastercard' : null) } }],
    },
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm(form.value)">
            <sxm-ui-credit-card-number-form-field formControlName="field"></sxm-ui-credit-card-number-form-field>
            <button type="submit">SUBMIT</button>
        </form>
    `,
    props: {
        ...commonProps,
    },
}));
