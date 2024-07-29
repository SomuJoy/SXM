import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
    selector: 'sxm-ui-alert-pill',
    templateUrl: './alert-pill.component.html',
    styleUrls: ['./alert-pill.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPillComponent {
    @HostBinding('attr.data-test') _dataTest = 'sxmUiAlertPill';
    /**
     * @deprecated Remove data-e2e once usages of it are refactored out to use data-test
     */
    @HostBinding('attr.data-e2e') _dataE2e = 'sxmUiAlertPill';
}
