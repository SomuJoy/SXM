import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSxmUiUiLoadingOverlayModule } from '@de-care/shared/sxm-ui/ui-loading-overlay';
import { SharedSxmUiUiAlertPillModule } from '@de-care/shared/sxm-ui/ui-alert-pill';
import { SxmUiLoadingWithAlertMessageComponent } from './loading-with-alert-message/loading-with-alert-message.component';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiLoadingOverlayModule, SharedSxmUiUiAlertPillModule],
    declarations: [SxmUiLoadingWithAlertMessageComponent],
    exports: [SxmUiLoadingWithAlertMessageComponent]
})
export class SharedSxmUiUiLoadingWithAlertMessageModule {}
