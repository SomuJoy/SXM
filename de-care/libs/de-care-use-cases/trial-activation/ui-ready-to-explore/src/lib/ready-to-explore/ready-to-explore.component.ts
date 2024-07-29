import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

/**
 * @deprecated Use <sxm-ui-ready-to-explore> via import { SxmUiReadyToExploreComponentModule } from '@de-care/shared-sxm-ui-navigation-ui-common-cta-navigation'
 */
@Component({
    selector: 'ready-to-explore',
    templateUrl: './ready-to-explore.component.html',
    styleUrls: ['./ready-to-explore.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadyToExploreComponent implements OnInit {
    translationKeyPrefix = 'DeCareUseCasesTrialActivationUiReadyToExploreModule.ReadyToExploreComponent';

    /**
     * Used for custom link query param pieces for a smart.link URL (the URL now comes from settings)
     * @type {string}
     * @public
     */
    @Input() listenNowCustomLink: string;
    @Input() infoForToken: { subscriptionId: string; useCase?: string } = null;
    @Input() isCanadaMode = false;

    constructor() {}

    ngOnInit() {}
}
