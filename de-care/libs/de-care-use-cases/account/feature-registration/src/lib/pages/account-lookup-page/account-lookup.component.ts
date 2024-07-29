import { Component, OnInit, AfterViewInit } from '@angular/core';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-account-lookup',
    templateUrl: './account-lookup.component.html',
    styleUrls: ['./account-lookup.component.scss'],
})
export class AccountLookupComponent implements OnInit, AfterViewInit {
    translateKey = 'deCareUseCasesAccountFeatureRegistration.accountLookupPageComponent';

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'noaccountsfound' }));
    }
}
