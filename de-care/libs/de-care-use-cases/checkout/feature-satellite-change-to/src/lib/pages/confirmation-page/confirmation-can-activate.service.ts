import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoadConfirmationDataWorkflowService, LoadConfirmationDataWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-satellite-change-to';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfirmationCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _LoadConfirmationDataWorkflowService: LoadConfirmationDataWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._LoadConfirmationDataWorkflowService.build().pipe(
            catchError((error: LoadConfirmationDataWorkflowServiceErrors) => {
                switch (error) {
                    case 'NO_TRANSACTION_STATE':
                    default: {
                        return of(this._router.createUrlTree(['./error']));
                    }
                }
            })
        );
    }
}
