import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { TranslateModule } from '@ngx-translate/core';
import { MOCK_NGRX_STORE_PROVIDER, TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule } from '../shared-sxm-ui-ui-charge-agreement-generic-checkbox-form-field.module';

const stories = storiesOf('Component Library/Forms/Credit Card/ChargeAgreementGenericCheckboxFormField', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), ReactiveFormsModule, SharedSxmUiUiChargeAgreementGenericCheckboxFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS, MOCK_NGRX_STORE_PROVIDER],
        })
    )
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<form [formGroup]="form"><sxm-ui-charge-agreement-generic-checkbox-form-field formControlName="field" formButtonTextCopy="Continue"></sxm-ui-charge-agreement-checkbox-form-field></form>`,
    props: {
        form: new FormGroup({ field: new FormControl(false) }),
    },
}));

stories.add('rate version', () => ({
    template: `<form [formGroup]="form"><sxm-ui-charge-agreement-generic-checkbox-form-field formControlName="field" formButtonTextCopy="Continue" [useRateVersionOfTextCopy]="true"></sxm-ui-charge-agreement-checkbox-form-field></form>`,
    props: {
        form: new FormGroup({ field: new FormControl(false) }),
    },
}));
