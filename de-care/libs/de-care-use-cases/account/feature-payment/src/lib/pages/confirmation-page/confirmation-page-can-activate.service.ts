import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { confirmationPageReady, confirmationPageReadyToShow } from '@de-care/de-care-use-cases/account/state-payment';

@Injectable({ providedIn: 'root' })
export class ConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.select(confirmationPageReady).pipe(
            take(1),
            tap(() => this._store.dispatch(confirmationPageReadyToShow())),
            catchError(() => of(this._goToGlobalError()))
        );
    }

    private _goToGlobalError(): UrlTree {
        return this._router.createUrlTree(['error']);
    }
}
