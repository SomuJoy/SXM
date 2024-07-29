import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const ENDPOINT_URL = '/identity/verify-student';

export interface StudentVerificationRequestModel {
    verificationId: string;
}

export interface StudentInfo {
    firstName: string;
    lastName: string;
    email: string;
}

export type NullableStudentInfo = StudentInfo | null;

export type StudentVerificationResponseModel = NullableStudentInfo;

@Injectable({ providedIn: 'root' })
export class DataVerifyStudentService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    verifyStudent(verificationId: string): Observable<StudentVerificationResponseModel> {
        const options = { withCredentials: true };
        return this._http.get<{ data: StudentVerificationResponseModel }>(`${this._url}${ENDPOINT_URL}/${verificationId}`, options).pipe(
            map(response => {
                return response.data || null;
            })
        );
    }
}
