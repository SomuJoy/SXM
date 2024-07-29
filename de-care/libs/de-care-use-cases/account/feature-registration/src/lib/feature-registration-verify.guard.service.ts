import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { selectVerifyPageGuard } from '@de-care/de-care-use-cases/account/state-registration';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanActivateRegistrationVerifyGuardService implements CanActivate {
    constructor(private _store: Store, private _router: Router) {}

    canActivate() {
        return this._store.pipe(
            select(selectVerifyPageGuard),
            take(1),
            map(result => {
                if (!result) {
                    return this._handleAccountNotFound();
                }
                return true;
            }),
            catchError(() => {
                return of(this._handleAccountNotFound());
            })
        );
    }

    private _handleAccountNotFound(): UrlTree {
        return this._router.createUrlTree(['account', 'registration', 'lookup']);
    }
}
