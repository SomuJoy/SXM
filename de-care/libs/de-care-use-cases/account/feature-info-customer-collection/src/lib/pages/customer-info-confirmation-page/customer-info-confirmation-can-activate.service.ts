import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class CustomerInfoConfirmationCanActivate implements CanActivate {
    constructor(private readonly _store: Store) {}

    canActivate(): Observable<boolean> {
        this._store.dispatch(pageDataFinishedLoading());
        return of(true);
    }
}
