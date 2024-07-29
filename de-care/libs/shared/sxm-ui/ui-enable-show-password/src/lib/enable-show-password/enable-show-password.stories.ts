import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { text, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiEnableShowPasswordModule } from '../shared-sxm-ui-ui-enable-show-password.module';

const stories = storiesOf('Component Library/Forms/Fields/EnableShowPassword', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [ReactiveFormsModule, SharedSxmUiUiEnableShowPasswordModule],
        })
    );

stories.add('default', () => ({
    template: `<form>
            <div class="input-container">
                <label for="{{ id }}" class="sr-only"></label>
                <input id="{{ id }}" type="password" maxlength="20" appEnableShowPassword />
            </div>
        </form>`,
    props: {
        formGroup: new FormGroup({ password: new FormControl('', { updateOn: 'blur' }) }),
        id: text('id', 'enablePasswordField'),
        labelText: text('labelText', 'Password'),
    },
}));
