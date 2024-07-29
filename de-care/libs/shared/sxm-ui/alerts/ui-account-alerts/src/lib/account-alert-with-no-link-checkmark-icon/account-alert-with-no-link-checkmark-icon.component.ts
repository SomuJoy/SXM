import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { AlertDetails } from '../interface';

@Component({
    selector: 'sxm-ui-account-alert-with-no-link-checkmark-icon',
    templateUrl: './account-alert-with-no-link-checkmark-icon.component.html',
    styleUrls: ['./account-alert-with-no-link-checkmark-icon.component.scss'],
})
export class SxmUiAccountAlertWithNoLinkCheckmarkIconComponent {
    translateKeyPrefix: string;
    @Input() data: AlertDetails;
}

@NgModule({
    imports: [CommonModule],
    declarations: [SxmUiAccountAlertWithNoLinkCheckmarkIconComponent],
    exports: [SxmUiAccountAlertWithNoLinkCheckmarkIconComponent],
})
export class SxmUiAccountAlertWithNoLinkCheckmarkIconModule {}
