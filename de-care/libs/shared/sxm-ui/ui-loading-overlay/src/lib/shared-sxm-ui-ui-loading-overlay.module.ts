import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiLoadingIndicatorModule } from '@de-care/shared/sxm-ui/ui-loading-indicator';
import { SxmLoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { SxmUiLoadingOverlaySxmLogoComponent } from './loading-overlay-sxm-logo/loading-overlay-sxm-logo.component';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiLoadingIndicatorModule, SxmUiLoadingOverlaySxmLogoComponent],
    declarations: [SxmLoadingOverlayComponent],
    exports: [SxmLoadingOverlayComponent, SxmUiLoadingOverlaySxmLogoComponent],
})
export class SharedSxmUiUiLoadingOverlayModule {}
