import { Injectable } from '@angular/core';
import {
    getDeviceFromRadioIdLastFourDigitsAndVehicleInfo,
    getSecondarySubscriptions,
    LoadAccountFromVipAccountInfoWorkflowService,
} from '@de-care/domains/account/state-account';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { LoadCustomerOffersWithCmsContent } from '@de-care/domains/offers/state-offers-with-cms';
import { DataWorkflow } from '@de-care/shared/util-workflow-interface';
import { Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mapTo, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { handleOrganicVipEligibilityError, OrganicVipElegibilityError } from '../helpers';
import { setFirstDevice, setSecondDevices, setSelectedPlanCode } from '../state/actions';
import { DeviceStatus } from '../state/models';
import { getProgramCode } from '../state/selectors';

type WorkflowResultType = 'ok' | OrganicVipElegibilityError;

@Injectable({ providedIn: 'root' })
export class UseRadioIdAfterLpzSuccessWorkflowService implements DataWorkflow<{ radioId: string }, WorkflowResultType> {
    constructor(
        private readonly _store: Store,
        private readonly _loadAccountFromVipAccountInfoWorkflowService: LoadAccountFromVipAccountInfoWorkflowService,
        private readonly _loadCustomerOffersWithCmsContent: LoadCustomerOffersWithCmsContent
    ) {}

    build({ radioId }: { radioId: string }): Observable<WorkflowResultType> {
        const radioLast4Digits = radioId.substring(radioId.length - 4, radioId.length);
        return this._loadAccountFromVipAccountInfoWorkflowService
            .build({
                params: {
                    radioId: radioLast4Digits,
                },
                allowErrorHandler: false,
            })
            .pipe(
                withLatestFrom(this._store.select(getProgramCode)),
                switchMap(([, programCode]) => this._loadCustomerOffersWithCmsContent.build({ radioId: radioLast4Digits, programCode, streaming: false })),
                withLatestFrom(
                    this._store.select(getSecondarySubscriptions),
                    this._store.select(getFirstOfferPlanCode),
                    this._store.select(getDeviceFromRadioIdLastFourDigitsAndVehicleInfo)
                ),
                tap(([, secondarySubscriptions, planCode, device]) => {
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
                }),
                mapTo('ok' as WorkflowResultType),
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
