import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { getIsCredentialRecoveryFlow, getUserEnteredEmailAndLastname } from '@de-care/de-care-use-cases/account/state-account-credentials-management';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RecoverUsernameTransactionStateGuard implements CanActivate {
    constructor(private readonly _router: Router, private readonly _store: Store, private _activatedRoute: ActivatedRoute) {}

    canActivate(): Observable<boolean> | Promise<any> {
        return this._store.pipe(
            select(getUserEnteredEmailAndLastname),
            take(1),
            withLatestFrom(this._store.pipe(select(getIsCredentialRecoveryFlow))),
            map(([transactionStateExists, isCredentialRecoveryFlow]) => {
                if (!transactionStateExists) {
                    if (isCredentialRecoveryFlow) {
                        this._navigateTo('/account/credentials');
                    } else {
                        this._navigateTo('/account/credentials/forgot-username');
                    }
                    return true;
                }
                return transactionStateExists;
            })
        );
    }

    private _navigateTo(destination: string): void {
        this._router.navigate([destination], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }
}
