import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading, selectActiveSubscriptionViewModel } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-active-subscription-page',
    templateUrl: './active-subscription-page.component.html',
    styleUrls: ['./active-subscription-page.component.scss'],
})
export class ActiveSubscriptionPageComponent implements OnInit {
    constructor(private _store: Store) {}

    activeSubscriptionViewModel$ = this._store.select(selectActiveSubscriptionViewModel);
    translateKeyPrefix = 'deCareUseCasesStudentVerificationFeatureConfirmReVerifyModule.activeSubscriptionPageComponent';
    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'StudentAlreadyExtendedPlan' }));
        this._store.dispatch(pageDataFinishedLoading());
    }
}
