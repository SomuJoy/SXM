import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'listen-now-with-icon',
    template: `
        <mat-icon svgIcon="streaming"></mat-icon>
        <h5>{{ translateKeyPrefix + 'HEADLINE' | translate }}</h5>
        <p class="text-color-gray-dark listen-now-component-subhead">{{ translateKeyPrefix + 'SUB_HEADLINE' | translate }}</p>
        <streaming-player-link
            [infoForToken]="infoForToken"
            [customLink]="customLink"
            [customLinkText]="translateKeyPrefix + 'LINK_TEXT' | translate"
            [isButton]="true"
        ></streaming-player-link>
    `,
    styleUrls: ['./listen-now-with-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListenNowWithIconComponent {
    translateKeyPrefix = 'DomainsSubscriptionsUiPlayerAppIntegrationModule.ListenNowWithIconComponent.';

    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() customLink: string;
    @Input() infoForToken: { subscriptionId: string; useCase: string } = null;
}
