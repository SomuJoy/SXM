import { Component, OnInit, AfterViewInit } from '@angular/core';
import { accountAlreadyRegisteredGoToLogin } from '@de-care/de-care-use-cases/account/state-registration';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { behaviorEventImpressionForPage } from '@de-care/shared/state-behavior-events';

@Component({
    selector: 'de-care-account-already-registered',
    templateUrl: './account-already-registered.component.html',
    styleUrls: ['./account-already-registered.component.scss']
})
export class AccountAlreadyRegisteredComponent implements OnInit, AfterViewInit {
    translateKey = 'deCareUseCasesAccountFeatureRegistration.accountAlreadyRegisteredComponent';

    constructor(private readonly _store: Store) {}

    ngOnInit(): void {
        this._store.dispatch(pageDataFinishedLoading());
    }

    ngAfterViewInit(): void {
        this._store.dispatch(behaviorEventImpressionForPage({ pageKey: 'registration', componentKey: 'alreadyregistered' }));
    }

    signIn(): void {
        this._store.dispatch(accountAlreadyRegisteredGoToLogin());
    }
}
