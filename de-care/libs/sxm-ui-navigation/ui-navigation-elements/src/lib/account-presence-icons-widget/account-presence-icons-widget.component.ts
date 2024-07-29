import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { AccountIconsNoPresenceComponent, AccountIconsNoPresenceComponentApi } from '../account-icons-no-presence/account-icons-no-presence.component';
import { AccountPresenceIconsComponent, AccountPresenceIconsComponentApi } from '../account-presence-icons/account-presence-icons.component';

@Component({
    template: `
        <ng-container *ngIf="canLogin; else loginLinkIcon">
            <account-presence-icons></account-presence-icons>
        </ng-container>
        <ng-template #loginLinkIcon>
            <account-icons-no-presence></account-icons-no-presence>
        </ng-template>
    `,
})
export class AccountPresenceIconsWidgetComponent {
    canLogin = true;
    @ViewChild(AccountPresenceIconsComponent) private readonly _accountPresenceIconsComponent: AccountPresenceIconsComponentApi;
    @ViewChild(AccountIconsNoPresenceComponent) private readonly _accountIconsNoPresenceComponent: AccountIconsNoPresenceComponentApi;
    @Input() get closePanels() {
        return () => {
            this._accountPresenceIconsComponent?.closePanels();
            this._accountIconsNoPresenceComponent?.closePanels();
        };
    }

    constructor(@Inject(DOCUMENT) readonly document: Document) {
        this.canLogin = ['siriusxm.com', 'siriusxm.ca'].includes(getDomainNameFromHostName(document?.defaultView?.location?.hostname));
    }
}

function getDomainNameFromHostName(hostName: string): string {
    return hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
}
