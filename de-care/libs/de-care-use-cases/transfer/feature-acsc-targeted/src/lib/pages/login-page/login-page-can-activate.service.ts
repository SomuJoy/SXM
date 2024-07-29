import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CheckUserIsLoggedInWorkflow } from '@de-care/domains/account/state-login';

@Injectable({ providedIn: 'root' })
export class LoginPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _checkUserIsLoggedInWorkflow: CheckUserIsLoggedInWorkflow) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._checkUserIsLoggedInWorkflow.build().pipe(
            map((isLoggedIn: boolean) => {
                return isLoggedIn ? this._router.createUrlTree(['/transfer/radio/login-router']) : true;
            }),
            catchError(() => {
                return of(true);
            })
        );
    }
}
