import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { SharedSxmUiUiDataClickTrackModule } from '@de-care/shared/sxm-ui/ui-data-click-track';
import { AlertDetails } from '../interface';

@Component({
    selector: 'sxm-ui-account-alert-with-link-tag-icon',
    templateUrl: './account-alert-with-link-tag-icon.component.html',
    styleUrls: ['./account-alert-with-link-tag-icon.component.scss'],
})
export class SxmUiAccountAlertWithLinkTagIconComponent {
    translateKeyPrefix: string;
    @Input() data: AlertDetails;
    @Output() alertLinkClicked = new EventEmitter<string>();
}

@NgModule({
    imports: [CommonModule, SharedSxmUiUiDataClickTrackModule],
    declarations: [SxmUiAccountAlertWithLinkTagIconComponent],
    exports: [SxmUiAccountAlertWithLinkTagIconComponent],
})
export class SxmUiAccountAlertWithLinkTagIconModule {}
