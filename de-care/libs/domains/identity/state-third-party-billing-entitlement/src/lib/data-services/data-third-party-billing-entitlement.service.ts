import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import { MicroservicesResponse } from './microservice-response.interface';
import { ThirdPatyBillingEntitlementData, ThirdPartyBillingActivationResponseData, ThirdPartyBillingActivationRequestData } from './third-party-billing-entitlement.model';
import { map } from 'rxjs/operators';
const ENTITLEMENT_ENDPOINT_URL = '/identity/customer/entitlement';
const ACTIVATE_TPB_ENDPOINT_URL = '/trial-activation/activate-third-party-subscription';

@Injectable({ providedIn: 'root' })
export class DataThirdPartyBillingEntitlementService {
    private readonly _url: string;

    constructor(private readonly _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    getEntitlement(entitlementId: string) {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<ThirdPatyBillingEntitlementData>>(`${this._url}${ENTITLEMENT_ENDPOINT_URL}`, { entitlementId }, options).pipe(
            map(response => {
                return response.data || null;
            })
        );
    }

    activateThirdPartySubscription(thirdPartyBillingActivationRequestData: ThirdPartyBillingActivationRequestData) {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<ThirdPartyBillingActivationResponseData>>(`${this._url}${ACTIVATE_TPB_ENDPOINT_URL}`, thirdPartyBillingActivationRequestData, options)
            .pipe(
                map(response => {
                    return response.data.resultCode === 'SUCCESS';
                })
            );
    }
}
