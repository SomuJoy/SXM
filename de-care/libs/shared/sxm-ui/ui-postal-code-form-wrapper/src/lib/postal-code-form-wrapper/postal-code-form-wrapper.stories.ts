import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { action } from '@storybook/addon-actions';
import { TRANSLATE_PROVIDERS, TRANSLATE_PROVIDERS_CA } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiPostalCodeFormWrapperModule } from '../shared-sxm-ui-ui-postal-code-form-wrapper.module';
import { SettingsService } from '@de-care/settings';

const stories = storiesOf('Component Library/Forms/Fields/PostalCodeFormWrapper', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiPostalCodeFormWrapperModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    );

function createForm() {
    return new FormGroup({ address: new FormControl('', Validators.required) });
}
function onFormSubmit(form: FormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
        action(`Input filled out`)(form.value.address.zip);
    }
}

stories.add('default', () => ({
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
            <sxm-ui-postal-code-form-wrapper formControlName="address" ></sxm-ui-postal-code-form-wrapper>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    `,
    styles: [`button { all: revert; }`],
    props: {
        form: createForm(),
        onSubmit: onFormSubmit,
    },
}));
