import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SxmUiPrimaryPackageCardPlaceholderComponentModule } from '../primary-package-card-placeholder/primary-package-card-placeholder.component';

@Component({
    selector: 'sxm-ui-primary-package-card-skeleton-loader',
    template: `
        <div class="gradient-animation"></div>
        <sxm-ui-primary-package-card-placeholder></sxm-ui-primary-package-card-placeholder>
    `,
    styleUrls: ['./primary-package-card-skeleton-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiPrimaryPackageCardSkeletonLoaderComponent {}

@NgModule({
    declarations: [SxmUiPrimaryPackageCardSkeletonLoaderComponent],
    exports: [SxmUiPrimaryPackageCardSkeletonLoaderComponent],
    imports: [SxmUiPrimaryPackageCardPlaceholderComponentModule],
})
export class SxmUiPrimaryPackageCardSkeletonLoaderComponentModule {}
