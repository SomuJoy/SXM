import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadFullPriceConfirmationDataWorkflowService, LoadTierUpConfirmationDataWorkflowServiceErrors } from '@de-care/de-care-use-cases/checkout/state-upgrade';

@Injectable({ providedIn: 'root' })
export class FullPriceConfirmationPageCanActivateService implements CanActivate {
    constructor(private readonly _router: Router, private readonly _loadFullPriceConfirmationDataWorkflowService: LoadFullPriceConfirmationDataWorkflowService) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this._loadFullPriceConfirmationDataWorkflowService.build().pipe(
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
