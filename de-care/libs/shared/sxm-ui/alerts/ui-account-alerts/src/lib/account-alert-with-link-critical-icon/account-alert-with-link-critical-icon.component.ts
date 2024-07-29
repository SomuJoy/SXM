import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { AlertDetails } from '../interface';

@Component({
    selector: 'sxm-ui-account-alert-with-link-critical-icon',
    templateUrl: './account-alert-with-link-critical-icon.component.html',
    styleUrls: ['./account-alert-with-link-critical-icon.component.scss'],
})
export class SxmUiAccountAlertWithLinkCriticalIconComponent {
    translateKeyPrefix: string;
    @Input() data: AlertDetails;
    @Output() alertLinkClicked = new EventEmitter<string>();
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [SxmUiAccountAlertWithLinkCriticalIconComponent],
    exports: [SxmUiAccountAlertWithLinkCriticalIconComponent],
})
export class SxmUiAccountAlertWithLinkCriticalIconModule {}
