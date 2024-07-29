import { Injectable } from '@angular/core';
import { tap, map, withLatestFrom, concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AccountDataRequest, AccountModel, DataAccountService, DataDevicesService, VehicleModel } from '@de-care/data-services';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import {
    behaviorEventReactionForCustomerType,
    behaviorEventReactionNonPiiActiveSubscriptionId,
    behaviorEventReactionNonPiiActiveSubscriptionStatus,
    behaviorEventReactionNonPiiClosedDeviceSubscriptionId,
    behaviorEventReactionNonPiiDevicePromoCode,
    behaviorEventReactionNonPiiMarketingId,
    behaviorEventReactionDevicePromoCode,
    behaviorEventReactionDeviceInfo,
    behaviorEventReactionClosedDevicesInfo,
} from '@de-care/shared/state-behavior-events';
import {
    getDevicePromoCode,
    getFirstSubscription,
    getLastFourDigitsOfAccountNumber,
    getSubscriptionIdFromClosedDevice,
    inTrialPostTrialSelfPayCustomerType,
} from '@de-care/domains/account/state-account';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';

@Injectable({ providedIn: 'root' })
export class NonPiiLookupWorkflow implements DataWorkflow<AccountDataRequest, AccountModel> {
    constructor(private _store: Store, private _dataAccountService: DataAccountService, private _dataDevicesService: DataDevicesService) {}
    /**
     * @deprecated Use workflows from @de-care/domains/account/state-account
     */
    build(request: AccountDataRequest): Observable<AccountModel & { last4DigitsOfAccountNumber?: string }> {
        // ToDo: Device validation call may not be necessary once /account/non-pii service error response is updated by ESB team
        if (this._hasFullRadioId(request) || request.identifiedUser) {
            return this._dataDevicesService.validate({ radioId: request.radioId }, false).pipe(
                concatMap((radioId) => {
                    return this._lookupNonPIIAccount(request);
                })
            );
        } else {
            return this._lookupNonPIIAccount(request);
        }
    }

    private _hasFullRadioId(request: AccountDataRequest) {
        return request.radioId && request.radioId.length > 4;
    }

    private _lookupNonPIIAccount(request: AccountDataRequest): Observable<AccountModel & { last4DigitsOfAccountNumber?: string }> {
        return this._dataAccountService.nonPii(request).pipe(
            withLatestFrom(this._store.pipe(select(getPvtTime))),
            tap(([response, pvtTime]) => {
                const { marketingId, marketingAcctId: marketingAccountId, nonPIIAccount: account } = response;
                this._store.dispatch(behaviorEventReactionNonPiiMarketingId({ marketingId, marketingAccountId }));

                if (account) {
                    const closedRadioSubscriptionId = getSubscriptionIdFromClosedDevice(account as any);
                    if (closedRadioSubscriptionId) {
                        this._store.dispatch(behaviorEventReactionNonPiiClosedDeviceSubscriptionId({ id: closedRadioSubscriptionId }));
                    }
                    this._store.dispatch(behaviorEventReactionForCustomerType({ customerType: inTrialPostTrialSelfPayCustomerType(account, pvtTime, false) }));
                    const firstSubscription = getFirstSubscription(account as any);
                    this._store.dispatch(behaviorEventReactionNonPiiActiveSubscriptionId({ id: firstSubscription?.id }));
                    this._store.dispatch(behaviorEventReactionNonPiiActiveSubscriptionStatus({ status: firstSubscription?.status }));
                    const devicePromoCode = getDevicePromoCode(account as any);
                    if (devicePromoCode) {
                        this._store.dispatch(behaviorEventReactionNonPiiDevicePromoCode({ promoCode: devicePromoCode }));
                        //TODO: This action is dispatched from a deprecated workflow because it is used instead of the domain workflow. The sales flow needs to be refactored.
                        this._store.dispatch(behaviorEventReactionDevicePromoCode({ devicePromoCode }));
                    }
                }
            }),
            tap((response) => {
                if (response) {
                    const radioService = response[0]?.nonPIIAccount?.subscriptions[0]?.radioService || (response[0]?.nonPIIAccount?.closedDevices[0] as any);
                    if (radioService) {
                        this._store.dispatch(
                            behaviorEventReactionDeviceInfo({
                                esn: radioService.last4DigitsOfRadioId,
                                vehicleInfo: { year: radioService.vehicleInfo.year as string, make: radioService.vehicleInfo.make, model: radioService.vehicleInfo.model },
                            })
                        );
                    }
                    if (response[0]?.nonPIIAccount?.closedDevices?.length > 0) {
                        this._store.dispatch(
                            behaviorEventReactionClosedDevicesInfo({
                                closedDevices: response[0]?.nonPIIAccount?.closedDevices?.map((d) => {
                                    return { dateClosed: d.closedDate, esnLast4Digits: d.last4DigitsOfRadioId };
                                }),
                            })
                        );
                    }
                }
            }),
            map(([response]) => {
                if (response.nonPIIAccount) {
                    return {
                        ...response.nonPIIAccount,
                        last4DigitsOfAccountNumber: getLastFourDigitsOfAccountNumber(response.marketingAcctId),
                    };
                } else {
                    const fieldErrors = [{ fieldName: 'radioId' }];
                    const httpErrorDetails = {
                        status: 400,
                        statusText: 'OK',
                        error: {
                            message: 'No account found',
                            error: { fieldErrors: fieldErrors },
                            httpStatus: 'BAD_REQUEST',
                            httpStatusCode: 400,
                            status: 'FAILURE',
                        },
                    };
                    throw new HttpErrorResponse(httpErrorDetails);
                }
            })
        );
    }
}
