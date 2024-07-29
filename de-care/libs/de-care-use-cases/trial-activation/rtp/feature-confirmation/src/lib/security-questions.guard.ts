import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAccountIsEligibleForRegistration } from '@de-care/de-care-use-cases/trial-activation/rtp/state-shared';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapTo, take, tap } from 'rxjs/operators';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';

@Injectable({ providedIn: 'root' })
export class SecurityQuestionsGuard implements CanActivate {
    constructor(private readonly _store: Store, private readonly _router: Router) {}

    canActivate(): Observable<boolean> {
        return this._store.pipe(
            select(getAccountIsEligibleForRegistration),
            take(1),
            tap(accountIsEligibleForRegistration => {
                if (accountIsEligibleForRegistration) {
                    this._store.dispatch(fetchSecurityQuestions({ accountRegistered: false }));
                }
            }),
            mapTo(true)
        );
    }
}
