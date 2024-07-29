import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import {
    setCompleteOrderStatusAsProcessing,
    setCompleteOrderStatusAsNotProcessing,
    setFirstDeviceRequestStatusAsSuccess,
    setFirstDeviceRequestStatusAsError,
    setSecondDeviceRequestStatusAsSuccess,
    setSecondDeviceRequestStatusAsError,
    setSecondDeviceCredentialsStatus,
    setFirstDeviceCredentialsStatus,
    setFirstDeviceExistingMaskedUsername,
    setSecondDeviceExistingMaskedUsername,
    setFirstDeviceExistingEmailOrUsername,
    setSubscriptionIdPrimaryRadio,
    setSubscriptionIdSecondaryRadio,
} from '../state/actions';
import { ChangeSubscriptionWorkflowService } from '@de-care/domains/purchase/state-change-subscription';
import { AddSubscriptionWorkflowService } from '@de-care/domains/purchase/state-add-subscription';
import { CreditCardUnexpectedError } from '@de-care/shared/de-microservices-common';
import { purchaseTransactionRequestData } from '../state/review-order.selectors';
import { DeviceCredentialsStatus } from '../state/models';
import { getFirstRadioIsClosed, getFirstRadioIsTrial, getSecondDevice, getSecondRadioIsClosed, getSelectedStreamingAccount } from '../state/selectors';
import { TranslateService } from '@ngx-translate/core';
import { newTransactionIdDueToCreditCardError, setIsRefreshAllowed } from '@de-care/de-care-use-cases/checkout/state-common';

@Injectable()
export class ProcessCompleteOrderStatusWorkflowService implements DataWorkflow<void, boolean> {
    constructor(
        private readonly _store: Store,
        private readonly _addSubscriptionWorkflowService: AddSubscriptionWorkflowService,
        private readonly _changeSubscriptionWorkflowService: ChangeSubscriptionWorkflowService,
        private _translateService: TranslateService
    ) {}

    private _handleGenericError(error: any) {
        this._store.dispatch(setCompleteOrderStatusAsNotProcessing());
        return throwError(error);
    }

    private _handleErrorForRequestReports(error: any, action) {
        if (error === 'CREDIT_CARD_FAILURE' || error instanceof CreditCardUnexpectedError) {
            this._store.dispatch(newTransactionIdDueToCreditCardError());
        } else {
            this._store.dispatch(action());
        }
    }

    build(): Observable<boolean> {
        return this._store.pipe(
            select(getFirstRadioIsTrial),
            take(1),
            tap(() => this._store.dispatch(setCompleteOrderStatusAsProcessing())),
            withLatestFrom(this._store.select(getSecondDevice), this._store.select(getSelectedStreamingAccount)),
            concatMap(([firstRadioIsTrial, secondDevice, streamingAccount]) => {
                if (firstRadioIsTrial && secondDevice) {
                    return this._processSecondRadio().pipe(concatMap(() => this._processFirstRadio()));
                } else if (secondDevice || streamingAccount) {
                    return this._processFirstRadio().pipe(concatMap(() => this._processSecondRadio()));
                } else {
                    return this._processFirstRadio().pipe(
                        tap(() => {
                            this._store.dispatch(setCompleteOrderStatusAsNotProcessing());
                        })
                    );
                }
            }),
            mergeMap(() => of(true))
        );
    }

    private _processFirstRadio() {
        return this._store.select(purchaseTransactionRequestData).pipe(
            take(1),
            withLatestFrom(this._store.select(getFirstRadioIsClosed)),
            concatMap(([{ firstDeviceRequest }, firstRadioIsClosed]) =>
                firstRadioIsClosed
                    ? this._addSubscriptionWorkflowService.build({ ...firstDeviceRequest, languagePreference: this._translateService.currentLang }, false)
                    : this._changeSubscriptionWorkflowService.build({ ...firstDeviceRequest, languagePreference: this._translateService.currentLang }, false)
            ),
            tap((data) => {
                const status = this._getDeviceCredentialsStatusAccordingResponse(data);
                this._store.dispatch(setFirstDeviceExistingMaskedUsername({ firstDeviceExistingMaskedUsername: data.maskedStreamingUserName }));
                this._store.dispatch(setFirstDeviceExistingEmailOrUsername({ firstDeviceExistingEmailOrUsername: data.email }));
                this._store.dispatch(setFirstDeviceCredentialsStatus({ deviceCredentialsStatus: status }));
                this._store.dispatch(setFirstDeviceRequestStatusAsSuccess());
                this._store.dispatch(setSubscriptionIdPrimaryRadio({ subscriptionId: data?.subscriptionId }));
                this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: data.isRefreshAllowed }));
            }),
            catchError((error) => {
                this._handleErrorForRequestReports(error, setFirstDeviceRequestStatusAsError);
                return this._handleGenericError(error);
            })
        );
    }

    private _processSecondRadio() {
        return this._store.select(purchaseTransactionRequestData).pipe(
            take(1),
            withLatestFrom(this._store.select(getSecondRadioIsClosed), this._store.select(getSelectedStreamingAccount)),
            concatMap(([{ secondDeviceRequest }, secondDeviceIsClosed, selectedStreamingAccount]) =>
                secondDeviceIsClosed || (selectedStreamingAccount && selectedStreamingAccount.password)
                    ? this._addSubscriptionWorkflowService.build({ ...secondDeviceRequest, languagePreference: this._translateService.currentLang }, false)
                    : this._changeSubscriptionWorkflowService.build({ ...secondDeviceRequest, languagePreference: this._translateService.currentLang }, false)
            ),
            tap((data) => {
                const status = this._getDeviceCredentialsStatusAccordingResponse(data);
                this._store.dispatch(setSecondDeviceExistingMaskedUsername({ secondDeviceExistingMaskedUsername: data.maskedStreamingUserName }));
                this._store.dispatch(setSecondDeviceCredentialsStatus({ deviceCredentialsStatus: status }));
                this._store.dispatch(setSecondDeviceRequestStatusAsSuccess());
                this._store.dispatch(setCompleteOrderStatusAsNotProcessing());
                this._store.dispatch(setSubscriptionIdSecondaryRadio({ subscriptionId: data?.subscriptionId }));
                this._store.dispatch(setIsRefreshAllowed({ isRefreshAllowed: data.isRefreshAllowed }));
            }),
            catchError((error) => {
                this._handleErrorForRequestReports(error, setSecondDeviceRequestStatusAsError);
                return this._handleGenericError(error);
            })
        );
    }

    private _getDeviceCredentialsStatusAccordingResponse(data: { isEligibleForRegistration?: boolean; isEligibleForStreamingCredentialsOnly?: boolean }) {
        if (data.isEligibleForRegistration) {
            return DeviceCredentialsStatus.EligibleForRegistration;
        } else if (data.isEligibleForStreamingCredentialsOnly) {
            return DeviceCredentialsStatus.EligibleForStreamingCredentialsOnly;
        } else {
            return DeviceCredentialsStatus.AlreadyRegistered;
        }
    }
}
