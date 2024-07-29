import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { DataAccountNonPiiService } from '../data-services/data-account-non-pii.service';
import { loadAccountError, setAccount, setMarketingAccountId, setEmailId } from '../state/actions';
import {
    behaviorEventReactionForCustomerType,
    behaviorEventReactionNonPiiActiveSubscriptionId,
    behaviorEventReactionNonPiiActiveSubscriptionStatus,
    behaviorEventReactionNonPiiClosedDeviceSubscriptionId,
    behaviorEventReactionNonPiiDevicePromoCode,
    behaviorEventReactionNonPiiMarketingId,
    behaviorEventErrorFromUserInteraction,
    behaviorEventReactionOffersMarketType,
    behaviorEventReactionClosedDevicesInfo,
} from '@de-care/shared/state-behavior-events';
import {
    getDevicePromoCode,
    getFirstSubscription,
    getSubscriptionIdFromClosedDevice,
    inTrialPostTrialSelfPayCustomerType,
    isExpiredCreditCard,
    getMarketTypeFromAccount,
} from '../helpers/account-helpers';
import { HttpErrorResponse } from '@angular/common/http';

export interface WorkflowRequest {
    accountNumber?: string;
    radioId?: string;
    pvtTime?: string;
    lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class LoadAccountFromAccountDataWorkflow implements DataWorkflow<WorkflowRequest, boolean> {
    constructor(private readonly _dataAccountNonPiiService: DataAccountNonPiiService, private readonly _store: Store) {}

    build({ pvtTime, ...request }: WorkflowRequest): Observable<boolean> {
        return this._dataAccountNonPiiService.getAccount(request).pipe(
            tap(({ marketingId, marketingAcctId: marketingAccountId, email }) => {
                this._store.dispatch(setMarketingAccountId({ marketingAccountId }));
                this._store.dispatch(behaviorEventReactionNonPiiMarketingId({ marketingId, marketingAccountId }));
                this._store.dispatch(setEmailId({ email }));
            }),
            map(({ nonPIIAccount }) => nonPIIAccount),
            tap((nonPIIAccount) => this._store.dispatch(setAccount({ account: nonPIIAccount }))),
            tap((nonPIIAccount) => {
                if (nonPIIAccount?.closedDevices?.length > 0) {
                    this._store.dispatch(
                        behaviorEventReactionClosedDevicesInfo({
                            closedDevices: nonPIIAccount?.closedDevices?.map((d) => {
                                return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                            }),
                        })
                    );
                }
                this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: inTrialPostTrialSelfPayCustomerType(nonPIIAccount, pvtTime, false) }));

                const closedRadioSubscriptionId = getSubscriptionIdFromClosedDevice(nonPIIAccount);
                if (closedRadioSubscriptionId) {
                    this._store.dispatch(behaviorEventReactionNonPiiClosedDeviceSubscriptionId({ id: closedRadioSubscriptionId }));
                }

                const firstSubscription = getFirstSubscription(nonPIIAccount);
                this._store.dispatch(behaviorEventReactionNonPiiActiveSubscriptionId({ id: firstSubscription?.id }));
                this._store.dispatch(behaviorEventReactionNonPiiActiveSubscriptionStatus({ status: firstSubscription?.status }));

                const devicePromoCode = getDevicePromoCode(nonPIIAccount);
                if (devicePromoCode) {
                    this._store.dispatch(behaviorEventReactionNonPiiDevicePromoCode({ promoCode: devicePromoCode }));
                }

                const expiredCreditCard = isExpiredCreditCard(nonPIIAccount);
                if (expiredCreditCard) {
                    this._store.dispatch(behaviorEventErrorFromUserInteraction({ message: 'Checkout - Expired card on file' }));
                }

                const marketType = getMarketTypeFromAccount(nonPIIAccount);
                if (marketType) {
                    this._store.dispatch(behaviorEventReactionOffersMarketType({ marketType }));
                }
            }),
            mapTo(true),
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error?.status === 400) {
                    this._store.dispatch(behaviorEventReactionNonPiiActiveSubscriptionStatus({ status: 'Closed' }));
                }
                this._store.dispatch(loadAccountError({ error }));
                return throwError(error);
            })
        );
    }
}
