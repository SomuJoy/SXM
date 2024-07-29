import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { disablePageLoaderOnRouteEvent, pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class TurnOffFullPageLoaderCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): boolean {
        this._store.dispatch(pageDataFinishedLoading());
        this._store.dispatch(disablePageLoaderOnRouteEvent());
        return true;
    }
}
