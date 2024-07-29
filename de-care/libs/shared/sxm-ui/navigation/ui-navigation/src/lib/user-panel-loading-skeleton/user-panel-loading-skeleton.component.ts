import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'sxm-ui-user-panel-loading-skeleton',
    templateUrl: './user-panel-loading-skeleton.component.html',
    styleUrls: ['./user-panel-loading-skeleton.component.scss'],
})
export class SxmUiUserPanelLoadingSkeletonComponent {}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiUserPanelLoadingSkeletonComponent],
    exports: [SxmUiUserPanelLoadingSkeletonComponent],
})
export class SxmUiUserPanelLoadingSkeletonModule {}
