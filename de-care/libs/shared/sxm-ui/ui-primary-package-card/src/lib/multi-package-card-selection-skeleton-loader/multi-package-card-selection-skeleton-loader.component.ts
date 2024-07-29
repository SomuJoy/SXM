import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { SxmUiPrimaryPackageCardPlaceholderComponentModule } from '../primary-package-card-placeholder/primary-package-card-placeholder.component';

@Component({
    selector: 'sxm-ui-multi-package-card-selection-skeleton-loader',
    template: `
        <div class="gradient-animation"></div>
        <div>
            <ul>
                <li></li>
            </ul>
            <sxm-ui-primary-package-card-placeholder></sxm-ui-primary-package-card-placeholder>
        </div>
        <div>
            <ul>
                <li></li>
            </ul>
            <sxm-ui-primary-package-card-placeholder></sxm-ui-primary-package-card-placeholder>
        </div>
        <div class="content-spot"></div>
    `,
    styleUrls: ['./multi-package-card-selection-skeleton-loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SxmUiMultiPackageCardSelectionSkeletonLoaderComponent {}

@NgModule({
    declarations: [SxmUiMultiPackageCardSelectionSkeletonLoaderComponent],
    exports: [SxmUiMultiPackageCardSelectionSkeletonLoaderComponent],
    imports: [SxmUiPrimaryPackageCardPlaceholderComponentModule],
})
export class SxmUiMultiPackageCardSelectionSkeletonLoaderComponentModule {}
