import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
    LoadAccountFindTrialWorkflowService,
    LoadAccountFindTrialWorkflowServiceResponseStatus,
    LoadAccountFindTrialWorkflowServiceError,
} from '@de-care/de-care-use-cases/transfer/state-acsc-targeted';

@Injectable({ providedIn: 'root' })
export class LoggedInRouterCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadAccountFindTrialWorkflowService: LoadAccountFindTrialWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadAccountFindTrialWorkflowService.build().pipe(
            map((response: LoadAccountFindTrialWorkflowServiceResponseStatus) => {
                switch (response) {
                    case 'success':
                        return this._router.createUrlTree(['/transfer/radio']);
                    case 'no trial account':
                        return this._router.createUrlTree(['/transfer/radio/lookup']);
                }
            }),
            catchError((error: LoadAccountFindTrialWorkflowServiceError) => {
                switch (error) {
                    case 'network error':
                        return of(this._router.createUrlTree(['/transfer/radio/oac-redirect']));
                }
            })
        );
    }
}
