import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { accountIsInStepUpScenario } from '@de-care/de-care-use-cases/account/state-registration';
import { RegisterAccountNonPiiWorkflowService } from '@de-care/domains/account/state-account';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CanActivateRegistrationStepUpGuardService implements CanActivate {
    constructor(private readonly _store: Store, private readonly _registerAccountNonPiiWorkflow: RegisterAccountNonPiiWorkflowService, private readonly _router: Router) {}

    canActivate(): Observable<UrlTree> {
        return this._registerAccountNonPiiWorkflow.build({}).pipe(
            take(1),
            map(response => (!!response?.last4DigitsOfAccountNumber ? this._store.dispatch(accountIsInStepUpScenario({ response })) : this._handleRedirect())),
            map(() => this._router.createUrlTree(['account', 'registration', 'verify'])),
            catchError(() => of(this._handleRedirect()))
        );
    }

    private _handleRedirect(): UrlTree {
        return this._router.createUrlTree(['account', 'registration']);
    }
}
