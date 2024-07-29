import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPillComponent } from './alert-pill/alert-pill.component';
import { SharedSxmUiUiIconInfoModule } from '@de-care/shared/sxm-ui/ui-icon-info';
import { SharedSxmUiUiIconValidateModule } from '@de-care/shared/sxm-ui/ui-icon-validate';
import { SharedSxmUiUiIconWarningModule } from '@de-care/shared/sxm-ui/ui-icon-warning';
import { SharedSxmUiUiIconErrorModule } from '@de-care/shared/sxm-ui/ui-icon-error';

@NgModule({
    imports: [CommonModule, SharedSxmUiUiIconInfoModule, SharedSxmUiUiIconValidateModule, SharedSxmUiUiIconWarningModule, SharedSxmUiUiIconErrorModule],
    declarations: [AlertPillComponent],
    exports: [AlertPillComponent],
})
export class SharedSxmUiUiAlertPillModule {}
