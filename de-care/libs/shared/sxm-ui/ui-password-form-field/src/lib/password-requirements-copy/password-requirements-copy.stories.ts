import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { withKnobs } from '@storybook/addon-knobs';
import { SharedSxmUiUiPasswordFormFieldModule } from '../shared-sxm-ui-ui-password-form-field.module';

const stories = storiesOf('Component Library/Forms/Instructions/Password Requirements Copy', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiPasswordFormFieldModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withKnobs)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-password-requirements-copy></sxm-ui-password-requirements-copy>`,
}));
