import { Injectable } from '@angular/core';
import { map, withLatestFrom, concatMap, switchMap, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AccountDataRequest, DataDevicesService, AccountModel } from '@de-care/data-services';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { LoadAccountFromAccountDataWorkflow, selectAccount, getMarketingAccountId, Account } from '@de-care/domains/account/state-account';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';

@Injectable({ providedIn: 'root' })
export class NonPiiLookupTrialActivationWorkflow implements DataWorkflow<AccountDataRequest, Account> {
    constructor(private _store: Store, private _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow, private _dataDevicesService: DataDevicesService) {}

    build(request: AccountDataRequest): Observable<Account & { last4DigitsOfAccountNumber?: string }> {
        // ToDo: Device validation call may not be necessary once /account/non-pii service error response is updated by ESB team
        if (this._hasFullRadioId(request)) {
            return this._dataDevicesService.validate({ radioId: request.radioId }, false).pipe(
                concatMap(() => {
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

    private _lookupNonPIIAccount(request): Observable<Account & { last4DigitsOfAccountNumber?: string }> {
        return this._store.pipe(
            select(getPvtTime),
            take(1),
            tap((pvt) => {
                console.log(pvt);
            }),
            switchMap((pvtTime) =>
                this._loadAccountFromAccountDataWorkflow.build({ pvtTime, ...request }).pipe(
                    withLatestFrom(this._store.select(selectAccount), this._store.select(getMarketingAccountId)),
                    map(([success, account, marketingID]) => {
                        if (success) {
                            return {
                                ...account,
                                last4DigitsOfAccountNumber: marketingID,
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
                )
            )
        );
    }
}
