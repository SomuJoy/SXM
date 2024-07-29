import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'sxm-ui-skeleton-loader-panel',
    template: `
        <div class="gradient-animation"></div>
        <ng-content></ng-content>
    `,
    styleUrls: ['./skeleton-loader-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiSkeletonLoaderPanelComponent {}

@NgModule({
    declarations: [SxmUiSkeletonLoaderPanelComponent],
    exports: [SxmUiSkeletonLoaderPanelComponent],
})
export class SxmUiSkeletonLoaderPanelComponentModule {}
