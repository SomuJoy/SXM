import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getConfirmationPageParams } from '@de-care/de-care-use-cases/trial-activation/state-ad-supported-tier-one-click';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventImpressionForPage, behaviorEventReactionRefreshSignalBySignal, behaviorEventReactionRefreshSignalByText } from '@de-care/shared/state-behavior-events';
import { select, Store } from '@ngrx/store';

@Component({
    selector: 'de-care-confirmation-page',
    templateUrl: './confirmation-page.component.html',
    styleUrls: ['./confirmation-page.component.scss'],
})
export class ConfirmationPageComponent implements OnInit, AfterViewInit {
    readonly translateKeyPrefix = 'DeCareUseCasesTrialActivationFeatureAdSupportedTierOneClickModule.ConfirmationPageComponent';

    confirmationPageParams$ = this._store.pipe(select(getConfirmationPageParams));

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'last-preview', componentKey: 'confirmation' }));
    }
}
