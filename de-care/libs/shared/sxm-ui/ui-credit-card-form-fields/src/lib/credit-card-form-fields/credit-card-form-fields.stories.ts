import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { SharedSxmUiUiCreditCardFormFieldsModule } from '../shared-sxm-ui-ui-credit-card-form-fields.module';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('Component Library/Forms/Credit Card/Credit Card Form Fields', module)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiCreditCardFormFieldsModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    )
    .addDecorator(withKnobs)
    .addDecorator(withMockSettings)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-credit-card-form-fields [formGroup]="form.controls.paymentInfo"></sxm-ui-credit-card-form-fields>
            <button type="submit">SUBMIT</button>
        </form>
    `,
    props: {
        form: new FormGroup({ paymentInfo: new FormGroup({}) }),
        onSubmit: (form) => {
            form.markAllAsTouched();
            if (form.valid) {
                action('submitForm()')(form.value);
            }
        },
    },
}));
