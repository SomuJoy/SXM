import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadRegistrationWorkflowService, LoadRegistrationWorkflowServiceErrors } from './state/workflow/load-registration-workflow.service';

@Injectable({
    providedIn: 'root',
})
export class RegistrationPageGuard implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadRegistrationWorkflowService: LoadRegistrationWorkflowService) {}

    canActivate(): Observable<UrlTree | boolean> {
        return this._loadRegistrationWorkflowService.build().pipe(
            catchError((error: LoadRegistrationWorkflowServiceErrors) => {
                if (error === 'ACCOUNT_NOT_IN_SESSION') {
                    return of(this._router.createUrlTree(['account', 'registration']));
                } else {
                    return of(this._router.createUrlTree(['error']));
                }
            })
        );
    }
}
