import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { take, catchError, tap, switchMap } from 'rxjs/operators';
import { ThirdPartyBillingActivationWorkflowService } from '@de-care/domains/identity/state-third-party-billing-entitlement';
import { getActivationData } from '../state/selectors';
import { ProvisionAccountRoutingService } from '../provision-account-routing.service';

@Injectable({ providedIn: 'root' })
export class ProvisionAccountActivateWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _thirdPartyBillingActivationWorkflowService: ThirdPartyBillingActivationWorkflowService,
        private readonly _store: Store,
        private readonly _provisionAccountRoutingService: ProvisionAccountRoutingService
    ) {}

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getActivationData),
            take(1),
            switchMap(params => this._thirdPartyBillingActivationWorkflowService.build(params)),
            tap(success => {
                if (!success) {
                    this._provisionAccountRoutingService.goToEntitlementErrorPage();
                }
            }),
            catchError(e => {
                this._provisionAccountRoutingService.goToEntitlementErrorPage();
                return throwError(e);
            })
        );
    }
}
