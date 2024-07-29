import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '@de-care/settings';
import {
    IdentityFlepzRequestModel,
    IdentityDeviceLpRequestModel,
    IdentityDeviceLpResponseModel,
    IdentityLookupPhoneOrEmailRequestModel,
    IdentityLookupPhoneOrEmailResponseModel,
} from '../models/identity.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { SubscriptionModel } from '../models/subscription.model';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';

@Injectable({ providedIn: 'root' })
export class DataIdentityService {
    private url: string;

    constructor(private _http: HttpClient, private _env: SettingsService) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    /**
     * @deprecated Use CustomerFlepzLookupWorkflowService from @de-care/domains/identity/state-flepz-lookup
     */
    customerFlepz(flepzObject: IdentityFlepzRequestModel): Observable<SubscriptionModel[]> {
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<SubscriptionModel[]>>(`${this.url}${ENDPOINTS_CONSTANTS.IDENTITY_CUSTOMER_FLEPZ}`, flepzObject, options).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    /**
     * @deprecated Use LoadAccountSubscriptionFromEmailWorkflowService from @de-care/domains/account/state-account
     */
    lookupCustomerEmail(flepzObject: IdentityLookupPhoneOrEmailRequestModel): Observable<IdentityLookupPhoneOrEmailResponseModel[]> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<IdentityLookupPhoneOrEmailResponseModel[]>>(`${this.url}${ENDPOINTS_CONSTANTS.IDENTITY_CUSTOMER_EMAIL}`, flepzObject, options)
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }

    /**
     * @deprecated Use ValidateDeviceByLicensePlateDataWorkflowService from @de-care/domains/device/state-device-validate
     */
    deviceLicencePlate(licencePlateObject: IdentityDeviceLpRequestModel): Observable<IdentityDeviceLpResponseModel> {
        const options = { withCredentials: true };
        return this._http
            .post<MicroservicesResponse<IdentityDeviceLpResponseModel>>(`${this.url}${ENDPOINTS_CONSTANTS.IDENTITY_DEVICE_LICENSE_PLATE}`, licencePlateObject, options)
            .pipe(
                map((response) => {
                    return response.data;
                })
            );
    }
}
