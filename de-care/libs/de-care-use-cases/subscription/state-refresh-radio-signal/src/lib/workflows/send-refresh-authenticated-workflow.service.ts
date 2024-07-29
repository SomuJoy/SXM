import { Injectable } from '@angular/core';
import { LoadAccountFromAccountDataWorkflow, LoadAccountFromCustomerPhoneWorkflowService } from '@de-care/domains/account/state-account';
import { ValidateDeviceByRadioIdWorkflowService, ValidateDeviceByVinWorkflowService, ValidateDeviceWorkflowService } from '@de-care/domains/device/state-device-validate';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError, concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { getReceiverId } from '../state/selectors';

@Injectable({
    providedIn: 'root',
})
export class SendRefreshAuthenticatedWorkflowService {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromAccountDataWorkflow: LoadAccountFromAccountDataWorkflow,
        private readonly _validateDeviceWorkflowService: ValidateDeviceWorkflowService,
        private readonly _validateDeviceByVinWorkflowService: ValidateDeviceByVinWorkflowService,
        private readonly _loadAccountFromCustomerPhoneWorkflowService: LoadAccountFromCustomerPhoneWorkflowService,
        private readonly _validateDeviceByRadioIdWorkflowService: ValidateDeviceByRadioIdWorkflowService
    ) {}

    build() {
        return this._store.select(getReceiverId).pipe(
            withLatestFrom(this._store.select(getPvtTime)),
            map(([receiverId, pvtTime]) => ({ pvtTime, receiverId })),
            concatMap((request) => {
                const lastFourDigitRadioId = request.receiverId?.slice(-4);
                return this._validateDeviceWorkflowService.build({ radioId: request.receiverId }).pipe(
                    concatMap(() =>
                        this._loadAccountFromAccountDataWorkflow.build({ radioId: lastFourDigitRadioId }).pipe(
                            mapTo(true),
                            catchError((error) => {
                                return throwError(error);
                            })
                        )
                    ),
                    catchError((error) => {
                        return throwError(error);
                    })
                );
            })
        );
    }

    buildContact() {
        return this._store.select(getReceiverId).pipe(
            withLatestFrom(this._store.select(getPvtTime)),
            map(([receiverId, pvtTime]) => ({ pvtTime, receiverId })),
            concatMap((request) => {
                return this._loadAccountFromCustomerPhoneWorkflowService.build({ phone: request.receiverId }).pipe(
                    concatMap((data) => {
                        if (data && data.length > 0) {
                            return this._validateDeviceByRadioIdWorkflowService.build(data[0]?.radioService?.last4DigitsOfRadioId).pipe(
                                concatMap(() =>
                                    this._loadAccountFromAccountDataWorkflow.build({ radioId: data[0]?.radioService?.last4DigitsOfRadioId }).pipe(
                                        mapTo(true),
                                        catchError((error) => {
                                            return throwError(error);
                                        })
                                    )
                                ),
                                catchError((error) => {
                                    return throwError(error);
                                })
                            );
                        } else {
                            return throwError('CLOSED_RADIO');
                        }
                    }),
                    catchError((error) => {
                        return throwError(error);
                    })
                );
            })
        );
    }

    buildVin() {
        return this._store.select(getReceiverId).pipe(
            withLatestFrom(this._store.select(getPvtTime)),
            map(([receiverId, pvtTime]) => ({ pvtTime, receiverId })),
            concatMap((request) => {
                return this._validateDeviceByVinWorkflowService.build(request.receiverId).pipe(
                    concatMap(({ last4DigitsOfRadioId }) =>
                        this._loadAccountFromAccountDataWorkflow.build({ radioId: last4DigitsOfRadioId }).pipe(
                            mapTo(true),
                            catchError((error) => {
                                return throwError(error);
                            })
                        )
                    ),
                    catchError((error) => {
                        return throwError(error);
                    })
                );
            })
        );
    }
}
