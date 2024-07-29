import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { selectOfferRetailPrice, selectOfferPackageName, pageDataFinishedLoading } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent implements OnInit {
    constructor(private _store: Store) {}

    translateKeyPrefix = 'deCareUseCasesStudentVerificationFeatureConfirmReVerifyModule';

    retailPrice$ = this._store.select(selectOfferRetailPrice);
    packageName$ = this._store.select(selectOfferPackageName);

    ngOnInit() {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'authentication', componentKey: 'StudentNotEligibleToExtend' }));
        this._store.dispatch(pageDataFinishedLoading());
    }
}
