import { Component, Input } from '@angular/core';

@Component({
    selector: 'listen-now',
    templateUrl: './listen-now.component.html',
    styleUrls: ['./listen-now.component.scss'],
})
export class ListenNowComponent {
    translateKey = 'DomainsSubscriptionsUiPlayerAppIntegrationModule.ListenNowComponent.';

    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() customLink: string;
    @Input() infoForToken: { subscriptionId: string; useCase?: string } = null;
}
