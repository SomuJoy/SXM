import { Injectable } from '@angular/core';
import { SettingsService, ALLOW_ERROR_HANDLER_HEADER } from '@de-care/settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENDPOINTS_CONSTANTS } from '../configs/endpoints.constants';
import { ServerResponseProspectModel } from '../models/prospect.model';
import { MicroservicesResponse } from '../models/microservices-response.model';
import { map, tap } from 'rxjs/operators';
import { UsedCarTrialRequest, UsedCarTrialResponse } from '../models/used-car-trial.model';
import {
    behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode,
    behaviorEventReactionUsedCarEligibilityCheckRadioId,
    behaviorEventReactionUsedCarEligibilityCheckErrorCode
} from '@de-care/shared/state-behavior-events';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class DataTrialService {
    private readonly url: string;
    constructor(private readonly _http: HttpClient, private readonly _env: SettingsService, private readonly _store: Store) {
        this.url = `${this._env.settings.apiUrl}${this._env.settings.apiPath}`;
    }

    token(token: string, allowErrorHandler = true): Observable<ServerResponseProspectModel> {
        const url = `${this.url}${ENDPOINTS_CONSTANTS.PROSPECT_TRIAL_TOKEN}/${token}`;
        const options = {
            withCredentials: true,
            headers: {
                [ALLOW_ERROR_HANDLER_HEADER]: allowErrorHandler.toString()
            }
        };
        return this._http.get<MicroservicesResponse<ServerResponseProspectModel>>(url, options).pipe(map(response => response.data));
    }

    usedCarEligibilityCheck(request: UsedCarTrialRequest): Observable<UsedCarTrialResponse> {
        const url = `${this.url}${ENDPOINTS_CONSTANTS.TRIAL_USED_CAR_ELIGIBILITY_CHECK}`;
        const options = { withCredentials: true };
        return this._http.post<MicroservicesResponse<UsedCarTrialResponse>>(url, request, options).pipe(
            map(response => response.data),
            tap(response => {
                this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckRadioId({ radioId: response.last4DigitsOfRadioId }));
                if (!!response.devicePromoCode) {
                    this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckDevicePromoCode({ devicePromoCode: response.devicePromoCode }));
                }

                if (response.status !== 'SUCCESS') {
                    this._store.dispatch(behaviorEventReactionUsedCarEligibilityCheckErrorCode({ errorCode: response.errorCode }));
                }
            })
        );
    }
}
