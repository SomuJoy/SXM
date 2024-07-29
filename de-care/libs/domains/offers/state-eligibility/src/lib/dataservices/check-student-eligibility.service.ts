import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfferCheckEligibilityStudentStatus } from './check-eligibility-status.interface';

const ENDPOINT_URL = '/check-eligibility/student';

export interface OfferCheckEligibilityStudentRequestModel {
    subscriptionId: number;
}

export interface OfferCheckEligibilityStudentResponseModel {
    status: OfferCheckEligibilityStudentStatus;
}

@Injectable({ providedIn: 'root' })
export class CheckStudentEligibilityService {
    private _url: string;

    constructor(private _http: HttpClient, private settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    checkEligibilityForStudent(subscriptionId: string): Observable<OfferCheckEligibilityStudentResponseModel> {
        const options = { withCredentials: true };
        const eligibilityReq: OfferCheckEligibilityStudentRequestModel = { subscriptionId: Number(subscriptionId) };
        return this._http.post<{ data: OfferCheckEligibilityStudentResponseModel }>(`${this._url}${ENDPOINT_URL}`, eligibilityReq, options).pipe(
            map(response => {
                return response.data || null;
            })
        );
    }
}
