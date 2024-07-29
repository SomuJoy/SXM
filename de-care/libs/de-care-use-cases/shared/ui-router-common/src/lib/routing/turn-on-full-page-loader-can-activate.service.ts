import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { pageDataStartedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class TurnOnFullPageLoaderCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): boolean {
        this._store.dispatch(pageDataStartedLoading());
        return true;
    }
}
