import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

@Injectable()
export class RedirectFallbackPageCanActivateService implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        this._store.dispatch(pageDataFinishedLoading());
        return of(true);
    }
}
