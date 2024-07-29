import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { AlertDetails } from '../interface';

@Component({
    selector: 'sxm-ui-account-alert-with-link-warning-icon',
    templateUrl: './account-alert-with-link-warning-icon.component.html',
    styleUrls: ['./account-alert-with-link-warning-icon.component.scss'],
})
export class SxmUiAccountAlertWithLinkWarningIconComponent {
    translateKeyPrefix: string;
    @Input() data: AlertDetails;
    @Output() alertLinkClicked = new EventEmitter<string>();
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [SxmUiAccountAlertWithLinkWarningIconComponent],
    exports: [SxmUiAccountAlertWithLinkWarningIconComponent],
})
export class SxmUiAccountAlertWithLinkWarningIconModule {}
