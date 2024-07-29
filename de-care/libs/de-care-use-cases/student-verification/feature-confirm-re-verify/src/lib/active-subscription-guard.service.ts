import { AccountDataWorkflowService } from '@de-care/de-care-use-cases/student-verification/state-confirm-re-verify';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ActiveSubscriptionGuard implements CanActivate {
    constructor(private _router: Router, private _accountDataWorkflowService: AccountDataWorkflowService) {}

    canActivate() {
        return this._accountDataWorkflowService.build().pipe(
            take(1),
            map(isAccount => (isAccount ? true : this._goToError()))
        );
    }

    private _goToError(): UrlTree {
        return this._router.createUrlTree(['student', 're-verify', 'confirm', 'error']);
    }
}
