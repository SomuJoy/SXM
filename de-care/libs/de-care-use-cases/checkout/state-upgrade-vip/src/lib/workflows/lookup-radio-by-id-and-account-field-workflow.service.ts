import { Injectable } from '@angular/core';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    getAccountServiceAddressState,
    getSecondaryStreamingSubscriptions,
    getSecondarySubscriptions,
    LoadAccountFromVipAccountInfoWorkflowService,
} from '@de-care/domains/account/state-account';
import { catchError, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ValidateDeviceWorkflowService } from '@de-care/domains/device/state-device-validate';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { setFirstDevice, setSecondDevices, setSelectedPlanCode, setStreamingAccounts } from '../state/actions';
import { handleOrganicVipEligibilityError, OrganicVipElegibilityError } from '../helpers';
import { getProgramCode, getRadioIdAndVehicleInfoFromAccountRadio } from '../state/selectors';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { setPageStartingProvince } from '@de-care/domains/customer/state-locale';
import { DeviceStatus } from '../state/models';

// TODO: we might need to add other result types here so the UI can support routing to different error condition pages/messages
type WorkflowResultType = 'found' | OrganicVipElegibilityError;

@Injectable({ providedIn: 'root' })
export class LookupRadioByIdAndAccountFieldWorkflowService implements DataWorkflow<{ radioId: string; accountNumber?: string; lastname: string }, WorkflowResultType> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromVipAccountInfoWorkflowService: LoadAccountFromVipAccountInfoWorkflowService,
        private readonly _validateDeviceWorkflowService: ValidateDeviceWorkflowService,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    build({ radioId, accountNumber, lastName }: { radioId: string; accountNumber?: string; lastName?: string }): Observable<WorkflowResultType> {
        const radioLast4Digits = radioId.substring(radioId.length - 4, radioId.length);
        return this._validateDeviceWorkflowService.build({ radioId }).pipe(
            switchMap(() =>
                this._loadAccountFromVipAccountInfoWorkflowService.build({
                    params: {
                        radioId,
                        accountNumber,
                        lastName,
                    },
                    allowErrorHandler: false,
                })
            ),
            withLatestFrom(this._store.select(getProgramCode), this._store.select(getAccountServiceAddressState), this._store.select(getIsCanadaMode)),
            switchMap(([, programCode, province, isCanada]) =>
                this._loadCustomerOffersWithCmsContent.build({ radioId: radioLast4Digits, programCode, streaming: false, ...(isCanada && { province }) })
            ),
            withLatestFrom(
                this._store.select(getFirstOfferPlanCode),
                this._store.select(getSecondarySubscriptions),
                this._store.select(getSecondaryStreamingSubscriptions),
                this._store.select(getRadioIdAndVehicleInfoFromAccountRadio)
            ),
            tap(([, planCode, secondarySubscriptions, secondaryStreamingSubscriptions, device]) => {
                this._store.dispatch(setSelectedPlanCode({ planCode }));
                this._store.dispatch(setFirstDevice({ device }));
                this._store.dispatch(
                    setSecondDevices({
                        secondDevices: secondarySubscriptions.map((subscription) => {
                            const plan = subscription.plans?.[0];
                            return {
                                radioId: subscription.radioService.last4DigitsOfRadioId,
                                vehicle: subscription.radioService.vehicleInfo,
                                status: plan ? (plan.type.toUpperCase() as DeviceStatus) : 'CLOSED',
                                packageName: plan?.packageName,
                            };
                        }),
                    })
                );
                const streamingAccounts = secondaryStreamingSubscriptions?.filter((sub) => sub?.streamingService);
                this._store.dispatch(
                    setStreamingAccounts({
                        streamingAccounts: streamingAccounts?.map((subscription) => {
                            const plan = subscription.plans?.[0];
                            return {
                                ...subscription.streamingService,
                                packageName: plan?.packageName,
                            };
                        }),
                    })
                );
            }),
            withLatestFrom(this._store.select(getIsCanadaMode), this._store.select(getAccountServiceAddressState)),
            tap(([, isCanada, province]) => {
                if (isCanada) {
                    this._store.dispatch(setPageStartingProvince({ province, isDisabled: false }));
                }
            }),
            mapTo('found' as WorkflowResultType),
            catchError((response) => {
                const vipEligibilityError = handleOrganicVipEligibilityError(response);

                if (vipEligibilityError === 'serverError') {
                    return throwError(response);
                }
                return of(vipEligibilityError);
            })
        );
    }
}
