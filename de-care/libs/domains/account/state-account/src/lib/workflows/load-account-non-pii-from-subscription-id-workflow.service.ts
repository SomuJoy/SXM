import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';
import { Account } from '../data-services/account.interface';
import { Store } from '@ngrx/store';
import {
    behaviorEventReactionActiveSubscriptionPlanCodes,
    behaviorEventReactionClosedDevicesInfo,
    behaviorEventReactionCustomerCoreInfo,
    behaviorEventReactionNonPiiMarketingId,
} from '@de-care/shared/state-behavior-events';
import { loadAccountError, setAccount } from '../state/actions';

export interface NonPiiWorkflowFromSubscriptionIdRequest {
    subscriptionId?: string;
}
@Injectable({ providedIn: 'root' })
export class LoadAccountNonPiiFromSubscriptionIdWorkflowService implements DataWorkflow<NonPiiWorkflowFromSubscriptionIdRequest, boolean> {
    constructor(private readonly _dataAccountNonPiiService: DataAccountNonPiiService, private readonly _store: Store) {}

    build(request: NonPiiWorkflowFromSubscriptionIdRequest): Observable<boolean> {
        return this._dataAccountNonPiiService.getAccount(request).pipe(
            tap(({ marketingId, marketingAcctId }) => {
                this._store.dispatch(behaviorEventReactionNonPiiMarketingId({ marketingId, marketingAccountId: marketingAcctId }));
            }),
            tap(({ nonPIIAccount }) => {
                this._store.dispatch(behaviorEventReactionCustomerCoreInfo(nonPIIAccount));
                nonPIIAccount.subscriptions?.forEach((sub) => {
                    const plans = sub.plans.map((p) => ({ code: p.code }));
                    this._store.dispatch(behaviorEventReactionActiveSubscriptionPlanCodes({ plans }));
                });
                this._store.dispatch(setAccount({ account: nonPIIAccount }));
                if (nonPIIAccount?.closedDevices?.length > 0) {
                    this._store.dispatch(
                        behaviorEventReactionClosedDevicesInfo({
                            closedDevices: nonPIIAccount?.closedDevices?.map((d) => {
                                return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                            }),
                        })
                    );
                }
            }),
            mapTo(true),
            catchError((error) => {
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
