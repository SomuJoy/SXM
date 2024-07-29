import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { disablePageLoaderOnRouteEvent } from '@de-care/de-care/shared/state-loading';

@Injectable({ providedIn: 'root' })
export class DisableRoutingLoaderCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): boolean {
        this._store.dispatch(disablePageLoaderOnRouteEvent());
        return true;
    }
}
