import { MOCK_DATA_LAYER_PROVIDER, MOCK_DATA_VALIDATION_PROVIDER, TRANSLATE_PROVIDERS, withMockSettings } from '@de-care/shared/storybook/util-helpers';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';

import { TranslateModule } from '@ngx-translate/core';
import { SharedSxmUiUiFlepzFormFieldsModule, SxmUiFlepzFormFieldsComponent } from '@de-care/shared/sxm-ui/ui-flepz-form-fields';

const stories = storiesOf('Component Library/Forms/Groups/FlepzFormFields', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(
        moduleMetadata({
            imports: [TranslateModule.forRoot(), SharedSxmUiUiFlepzFormFieldsModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withMockSettings);

stories.add('flepz-form-fields', () => ({
    component: SxmUiFlepzFormFieldsComponent,
    moduleMetadata: {
        providers: [MOCK_DATA_LAYER_PROVIDER, MOCK_DATA_VALIDATION_PROVIDER],
    },
    props: {
        includeZip: boolean('@Input() includeZip', true),
        submitted: boolean('@Input() submitted', false),
        validateEmail: boolean('@Input() validateEmail', false),
        emailEVSValidation: boolean('@Input() emailEVSValidation', false),
    },
}));
