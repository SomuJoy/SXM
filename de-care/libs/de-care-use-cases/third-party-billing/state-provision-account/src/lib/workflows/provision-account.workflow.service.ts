import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { setEntitlementError, setEntitlementResults, setEntitlementId } from '../state/actions';
import { ThirdPartyBillingEntitlementWorkflowService, ThirdPatyBillingEntitlementData } from '@de-care/domains/identity/state-third-party-billing-entitlement';
import { behaviorEventReactionThirdPartyBillingResellerInfo } from '@de-care/shared/state-behavior-events';
import { getSelectedPartner } from '../state/selectors';

@Injectable({ providedIn: 'root' })
export class ProvisionAccountWorkflowService implements DataWorkflow<string, ThirdPatyBillingEntitlementData> {
    constructor(private readonly _thirdPartyBillingEntitlementWorkflowService: ThirdPartyBillingEntitlementWorkflowService, private readonly _store: Store) {}

    build(entitlementId: string) {
        return this._thirdPartyBillingEntitlementWorkflowService.build(entitlementId).pipe(
            tap(entitlementInfo => {
                this._store.select(getSelectedPartner).subscribe(selectedPartner => {
                    this._store.dispatch(
                        behaviorEventReactionThirdPartyBillingResellerInfo({ resellerCode: selectedPartner.resellerCode, partnerName: selectedPartner.partnerName })
                    );
                });

                if (entitlementInfo.resellerCode) {
                    this._store.dispatch(setEntitlementId({ entitlementId }));
                    this._store.dispatch(setEntitlementResults({ entitlementResults: entitlementInfo }));
                }
            }),
            catchError(e => {
                this._store.dispatch(setEntitlementError(e));
                return throwError(e);
            })
        );
    }
}
