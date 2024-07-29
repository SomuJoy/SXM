import { Component } from '@angular/core';

@Component({
    template: ` <sxm-ui-alerts-icon [alertCount]="alertCount"></sxm-ui-alerts-icon> `,
})
export class AlertsIconWithPanelComponent {
    alertCount = 0;
}
