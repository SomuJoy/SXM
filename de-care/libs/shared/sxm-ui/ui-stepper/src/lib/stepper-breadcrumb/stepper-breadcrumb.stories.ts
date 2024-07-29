import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SxmUiStepperBreadcrumbComponent } from './stepper-breadcrumb.component';

const stories = storiesOf('Component Library/Common/Steppers/StepperBreadcrumbComponent', module)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiStepperBreadcrumbComponent],
        })
    )
    .addDecorator(withA11y);

stories.add('default', () => ({
    template: `<sxm-ui-stepper-breadcrumb>Custom Text For BreadCrumb</sxm-ui-stepper-breadcrumb>`,
}));
