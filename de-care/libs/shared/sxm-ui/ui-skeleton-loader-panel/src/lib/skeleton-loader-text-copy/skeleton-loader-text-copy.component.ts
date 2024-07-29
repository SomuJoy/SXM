import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SxmUiPlaceholderTextCopyComponentModule } from '../placeholder-text-copy/placeholder-text-copy.component';

@Component({
    selector: 'sxm-ui-skeleton-loader-text-copy',
    template: `
        <div class="gradient-animation"></div>
        <sxm-ui-placeholder-text-copy></sxm-ui-placeholder-text-copy>
    `,
    styleUrls: ['./skeleton-loader-text-copy.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiSkeletonLoaderTextCopyComponent {}

@NgModule({
    declarations: [SxmUiSkeletonLoaderTextCopyComponent],
    exports: [SxmUiSkeletonLoaderTextCopyComponent],
    imports: [SxmUiPlaceholderTextCopyComponentModule],
})
export class SxmUiSkeletonLoaderTextCopyComponentModule {}
