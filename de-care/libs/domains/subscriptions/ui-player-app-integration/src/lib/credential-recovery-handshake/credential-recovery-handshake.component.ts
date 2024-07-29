import { Component, Input } from '@angular/core';
import { convertObjectToUrlQueryParamsString } from '@de-care/browser-common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'credential-recovery-handshake',
    template: `
        <streaming-player-link
            [customLink]="source ? (translateKeyPrefix + 'BACK_TO.' + source | translate) + params : ''"
            [isButton]="true"
            [customLinkText]="customLinkText"
            [customLinkClasses]="customLinkClasses"
            [source]="source"
        ></streaming-player-link>
    `,
    styles: [
        `
            a.button.loading [data-id='link-label'] {
                display: none;
            }
        `,
    ],
})
export class CredentialRecoveryHandshakeComponent {
    translateKeyPrefix = 'DomainsSubscriptionsUiPlayerAppIntegrationModule.CredentialRecoveryHandshakeComponent.';
    source: string;
    params: string;
    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() customLink: string;
    @Input() customLinkText: string;
    @Input() customLinkClasses: string;
    @Input() set srcValue(value: string) {
        // TODO: check the value to make sure it is one of the key values we support, otherwise fall back to a default one.
        this.source = value?.toUpperCase();
    }
    @Input() set paramValue(value: any) {
        if (value) {
            this.params = convertObjectToUrlQueryParamsString(value);
            if (
                this.source === 'PLAYER' ||
                this.source === 'EVERESTPLAYER' ||
                this.source === 'STREAMING' ||
                this.source === 'OAC' ||
                this.source === 'SCLOGIN' ||
                this.source === 'PROFILEPORTAL' ||
                this.source === 'ORGANIC'
            ) {
                this.params = '';
            } else if (this.params.length > 0) {
                this.params = '&' + this.params;
            }
        } else {
            this.params = '';
        }
    }

    constructor(readonly translateService: TranslateService) {}
}
