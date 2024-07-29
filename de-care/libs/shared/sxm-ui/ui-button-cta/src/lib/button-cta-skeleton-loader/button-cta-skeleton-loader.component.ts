import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SxmUiButtonCtaPlaceholderComponentModule } from '../button-cta-placeholder/button-cta-placeholder.component';

@Component({
    selector: 'sxm-ui-button-cta-skeleton-loader',
    template: `
        <div class="gradient-animation"></div>
        <sxm-ui-button-cta-placeholder></sxm-ui-button-cta-placeholder>
    `,
    styleUrls: ['./button-cta-skeleton-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiButtonCtaSkeletonLoaderComponent {}

@NgModule({
    declarations: [SxmUiButtonCtaSkeletonLoaderComponent],
    exports: [SxmUiButtonCtaSkeletonLoaderComponent],
    imports: [SxmUiButtonCtaPlaceholderComponentModule],
})
export class SxmUiButtonCtaSkeletonLoaderComponentModule {}
