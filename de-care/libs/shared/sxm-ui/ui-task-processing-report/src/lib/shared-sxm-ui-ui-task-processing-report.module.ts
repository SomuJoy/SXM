import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SxmUiTaskProcessingReportComponent } from './task-processing-report/task-processing-report.component';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiLoadingIndicatorModule],
    declarations: [SxmUiTaskProcessingReportComponent],
    exports: [SxmUiTaskProcessingReportComponent]
})
export class SharedSxmUiUiTaskProcessingReportModule {}
