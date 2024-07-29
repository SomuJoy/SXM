import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { completedTransactionDataExists } from '@de-care/de-care-use-cases/checkout/state-upgrade-vip';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { concatMap, filter, take, tap } from 'rxjs/operators';

@Injectable()
export class ConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._store.pipe(
            select(completedTransactionDataExists),
            take(1),
            tap(() => this._store.dispatch(fetchSecurityQuestions({ accountRegistered: false }))),
            concatMap(dataExists => (dataExists ? of(true).pipe(tap(() => this._store.dispatch(pageDataFinishedLoading()))) : of(this._router.createUrlTree(['/error']))))
        );
    }
}
