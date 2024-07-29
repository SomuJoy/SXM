import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { hidePageLoader } from '@de-care/de-care-use-cases/checkout/state-common';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class HidePageLoaderCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}
    canActivate() {
        this._store.dispatch(hidePageLoader());
        return true;
    }
}
