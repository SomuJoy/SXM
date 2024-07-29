import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'sxm-ui-alerts-panel-loading-skeleton',
    templateUrl: './alerts-panel-loading-skeleton.component.html',
    styleUrls: ['./alerts-panel-loading-skeleton.component.scss'],
})
export class SxmUiAlertsPanelLoadingSkeletonComponent {}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAlertsPanelLoadingSkeletonComponent],
    exports: [SxmUiAlertsPanelLoadingSkeletonComponent],
})
export class SxmUiAlertsPanelLoadingSkeletonModule {}
