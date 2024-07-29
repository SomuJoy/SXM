import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SxmUiStepHeaderTextBreadcrumbComponent } from './step-header-text-breadcrumb.component';

const stories = storiesOf('Component Library/Common/Steppers/StepHeaderTextBreadcrumb', module)
    .addDecorator(
        moduleMetadata({
            imports: [SxmUiStepHeaderTextBreadcrumbComponent],
        })
    )
    .addDecorator(withA11y);

stories.add('default', () => ({
    template: `
        <sxm-ui-step-header-text-breadcrumb>
            <ng-container breadcrumbText>Breadcrumb text</ng-container>
            <ng-container title>A title here</ng-container>
            <ng-container body>A body here</ng-container>
        </sxm-ui-step-header-text-breadcrumb>
    `,
}));
