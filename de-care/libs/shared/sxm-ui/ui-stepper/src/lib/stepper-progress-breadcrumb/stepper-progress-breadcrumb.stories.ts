import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { TRANSLATE_PROVIDERS, withTranslation } from '@de-care/shared/storybook/util-helpers';
import { SharedSxmUiUiStepperModule } from '../shared-sxm-ui-ui-stepper.module';

const stories = storiesOf('Component Library/Common/Steppers/StepperProgressBreadcrumb', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiStepperModule],
            providers: [...TRANSLATE_PROVIDERS],
        })
    )
    .addDecorator(withA11y)
    .addDecorator(withTranslation);

stories.add('default', () => ({
    template: `<sxm-ui-stepper-progress-breadcrumb currentStepNumber="1" numberOfSteps="3"></sxm-ui-stepper-progress-breadcrumb>`,
}));
