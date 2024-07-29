import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadTierUpConfirmationDataWorkflowService, LoadTierUpConfirmationDataWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-upgrade';

@Injectable()
export class TierUpConfirmationPageCanActivateService implements CanActivate {
    constructor(
        private readonly _store: Store,
        private readonly _router: Router,
        private readonly _loadTierUpConfirmationDataWorkflowService: LoadTierUpConfirmationDataWorkflowService
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadTierUpConfirmationDataWorkflowService.build().pipe(
            catchError((error: LoadTierUpConfirmationDataWorkflowServiceErrors) => {
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
