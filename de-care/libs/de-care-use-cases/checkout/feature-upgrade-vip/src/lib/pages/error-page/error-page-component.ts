import { Component } from '@angular/core';
import { getErrorCode } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { select, Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Component({
    selector: 'de-error-page',
    templateUrl: './error-page-component.html',
    styleUrls: ['./error-page-component.scss'],
})
export class ErrorPageComponent {
    errorCode$ = this._store.pipe(select(getErrorCode));

    constructor(private readonly _store: Store) {
        this._store.dispatch(pageDataFinishedLoading());
    }
}
