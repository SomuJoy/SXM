import { Component, Input } from '@angular/core';

export interface SxmUiTaskProcessingReportDataValue {
    taskName: string;
    success: boolean;
    errorMessage?: string;
}

export interface SxmUiTaskProcessingReportData {
    tasks: SxmUiTaskProcessingReportDataValue[];
}

@Component({
    selector: 'sxm-ui-task-processing-report',
    templateUrl: './task-processing-report.component.html',
    styleUrls: ['./task-processing-report.component.scss']
})
export class SxmUiTaskProcessingReportComponent {
    @Input() data: SxmUiTaskProcessingReportData;
}
