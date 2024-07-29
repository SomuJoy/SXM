import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class CompletePageLoadingOverlayCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): boolean {
        // TODO: find a better way to disable this full screen loading overlay so each component doesn't need to be responsible for it
        this._store.dispatch(pageDataFinishedLoading());
        return true;
    }
}
