import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// TODO: this component needs to move into the domains/subscriptions/ui-player-app-integration lib because it has a dependency on a child component from that lib
@Component({
    selector: 'sxm-ui-ready-to-explore-wrapper',
    templateUrl: './ready-to-explore-wrapper.component.html',
    styleUrls: ['./ready-to-explore-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadyToExploreWrapperComponent {
    @Input() headerText: string;
    @Input() listOfLinks: string[];
    @Input() displayFooter = false;
    @Input() footerText: string;
    @Input() footerLink: string;
    @Input() streamingLinkText: string;
    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() streamingLinkUrl: string;
    @Input() subscriptionID: string;
}
