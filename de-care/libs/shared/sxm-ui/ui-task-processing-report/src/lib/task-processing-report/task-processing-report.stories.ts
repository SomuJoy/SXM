import { moduleMetadata, storiesOf } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { SharedSxmUiUiTaskProcessingReportModule } from '../shared-sxm-ui-ui-task-processing-report.module';
import { SxmUiTaskProcessingReportComponent, SxmUiTaskProcessingReportData } from './task-processing-report.component';

const DEFAULT_INPUT_DATA: SxmUiTaskProcessingReportData = {
    tasks: [
        {
            taskName: 'Upgrading your 2019 Toyota Camry',
            success: true,
        },
        {
            taskName: 'Upgrading your 2021 Toyota Camry',
            success: false,
        },
    ],
};

const stories = storiesOf('Component Library/UI/TaskProcessingReport', module)
    .addDecorator(
        moduleMetadata({
            imports: [SharedSxmUiUiTaskProcessingReportModule],
        })
    )
    .addDecorator(withA11y);

stories.add('default', () => ({
    component: SxmUiTaskProcessingReportComponent,
    props: {
        data: DEFAULT_INPUT_DATA,
    },
}));
