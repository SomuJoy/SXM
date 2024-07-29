import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpsellRequestData } from '../interfaces';
import {
    PurchaseSubscriptionDataModel,
    PurchaseSubscriptionResponse,
    PurchaseCreateAccountDataModel,
    PrepaidRedeemRequest,
    TrialSubscriptionAccount,
    TrialSubscriptionResponse,
} from '../models/purchase.model';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { catchError, map } from 'rxjs/operators';
import { SettingsService } from '@de-care/settings';
import { Observable, of } from 'rxjs';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

export interface SlocTrialActivationResponse {
    email: string;
    status: string;
    radioId: string;
    subscriptionId: string;
    isEligibleForRegistration: boolean;
    isOfferStreamingEligible: boolean;
    isUserNameSameAsEmail: boolean;
}

@Injectable({ providedIn: 'root' })
export class DataPurchaseService {
    private _url: string;

    private readonly ccFailurePropKeys = Object.freeze([
        'error.purchase.service.credit.card.validation.failed',
        'error.purchase.service.paymentinfo.required.paymentInfo',
        'error.purchase.service.no.creditcard.on.account',
        'error.purchase.service.ccinfo.required.cardInfo',
        'error.purchase.service.creditcard.fraud.reject',
    ]);

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this._url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    activateTrialAccount(activateTrialSubscriptionData: PurchaseCreateAccountDataModel): Observable<PurchaseSubscriptionResponse> {
        return this._http
            .post<MicroservicesResponse<PurchaseSubscriptionResponse>>(
                `${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_ACTIVATE_TRIAL_NEW_ACCOUNT}`,
                activateTrialSubscriptionData,
                {
                    withCredentials: true,
                }
            )
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }

    changeSubscription(changeSubscriptonData: PurchaseSubscriptionDataModel): Observable<PurchaseSubscriptionResponse> {
        return this._http
            .post<MicroservicesResponse<PurchaseSubscriptionResponse>>(`${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_CHANGE_SUBSCRIPTION}`, changeSubscriptonData, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }

    /* todo implements its own interface */
    addSubscription(addSubscriptonData: PurchaseSubscriptionDataModel): Observable<PurchaseSubscriptionResponse> {
        return this._http
            .post<MicroservicesResponse<PurchaseSubscriptionResponse>>(`${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_ADD_SUBSCRIPTION}`, addSubscriptonData, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }

    createAccount(createSubscriptonData: PurchaseCreateAccountDataModel): Observable<PurchaseSubscriptionResponse> {
        // TODO change any when response structure is well defined
        return this._http
            .post<MicroservicesResponse<PurchaseSubscriptionResponse>>(`${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_CREATE_ACCOUNT}`, createSubscriptonData, {
                withCredentials: true,
            })
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }

    isCreditCardError(status: number, errorPropKey: string): boolean {
        return (status === 400 || status === 500) && this.ccFailurePropKeys.indexOf(errorPropKey) > -1;
    }

    activateTrialExistingAccount(data: TrialSubscriptionAccount): Observable<TrialSubscriptionResponse> {
        const url = `${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_ACTIVATE_TRIAL_ADD_SUBSCRIPTION}`;
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<TrialSubscriptionResponse>>(url, data, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    activateSLOCTrial(token: string): Observable<SlocTrialActivationResponse> {
        const url = `${this._url}${ENDPOINTS_CONSTANTS.PURCHASE_ACTIVATE_SLOC_TRIAL}/${token}`;
        const options = { withCredentials: true };
        return this._http.get<MicroservicesResponse<SlocTrialActivationResponse>>(url, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    redeemPrepaidCard(request: PrepaidRedeemRequest): Observable<any> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this._url}${ENDPOINTS_CONSTANTS.PAYMENT_GIFTCARD_INFO}`, request, options).pipe(
            map((response) => {
                return response.data;
            }),
            catchError(() =>
                of({
                    error: true,
                })
            )
        );
    }

    removePrepaidCard(): Observable<any> {
        const requestBody: Object = undefined;
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<string>>(`${this._url}${ENDPOINTS_CONSTANTS.PAYMENT_GIFTCARD_REMOVE}`, requestBody, options).pipe(
            map((response) => {
                return response.data;
            }),
            catchError(() =>
                of({
                    error: true,
                })
            )
        );
    }

    // NOTE payload should be full object
    /**
     * @deprecated use LoadUpsellOffersWorkflowService in domain @de-care/domains/offers/state-upsells instead
     */
    getUpsellOffers(upsellData: UpsellRequestData): Observable<any> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<any>>(`${this._url}${ENDPOINTS_CONSTANTS.OFFERS_UPSELL}`, upsellData, options).pipe(
            map((response) => {
                return response.data;
            }),
            catchError(() =>
                of({
                    error: true,
                })
            )
        );
    }
}
