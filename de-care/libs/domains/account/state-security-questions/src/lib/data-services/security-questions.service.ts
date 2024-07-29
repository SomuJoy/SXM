import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SettingsService } from '@de-care/settings';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SecurityQuestionsModel } from './security-questions.type';
import { MicroservicesResponse } from './microservice-response.interface';

const ENDPOINT_URL = '/utility/security-questions';

@Injectable({
    providedIn: 'root'
})
export class SecurityQuestionsService {
    private _url: string;

    // TODO: remove the SettingsService dependency by having module ask for baseUrl
    constructor(private _http: HttpClient, settingsService: SettingsService) {
        this._url = `${settingsService.settings.apiUrl}${settingsService.settings.apiPath}`;
    }

    fetchSecurityQuestions(): Observable<SecurityQuestionsModel[]> {
        return this._http
            .get<MicroservicesResponse<SecurityQuestionsModel[]>>(`${this._url}${ENDPOINT_URL}`, { withCredentials: true })
            .pipe(
                map(response => response?.data || []),
                catchError(() => of([]))
            );
    }
}
