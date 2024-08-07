import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/';

@Injectable({ providedIn: 'root' })
export class DataCmsTopicsService {
    constructor(private readonly _http: HttpClient, @Inject(CMS_API_BASE_URL) private readonly _apiUrl: string) {}

    getTopics(): Observable<unknown> {
        return this._http.get<unknown>(`${this._apiUrl}${ENDPOINT_URL}`);
    }
}
