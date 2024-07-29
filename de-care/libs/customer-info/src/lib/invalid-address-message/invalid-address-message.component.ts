import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'invalid-address-message',
    template: `
        <p>{{ 'customerInfo.invalidAddressMessageComponent.' + messageKey | translate }}</p>
    `,
    styles: [
        `
            :host {
                display: inline-block;
            }
        `
    ]
})
export class InvalidAddressMessageComponent {
    @HostBinding('class.invalid-feedback') invalid = true;
    @Input() set addressType(type: 'Billing' | 'Service') {
        this.messageKey = type === 'Service' ? 'INVALID_SERVICE_ADDRESS_ERROR' : 'INVALID_BILLING_ADDRESS_ERROR';
    }
    messageKey = 'INVALID_BILLING_ADDRESS_ERROR';
}
