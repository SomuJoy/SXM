import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerInfoConfig } from '../state/models';
import { APP_BASE_HREF } from '@angular/common';

const ENDPOINT_URL = 'assets/partner-info.json';

@Injectable({ providedIn: 'root' })
export class FetchPartnerInfoService {
    constructor(private readonly _http: HttpClient, @Inject(APP_BASE_HREF) private readonly baseHref: string) {}

    fetch(): Observable<PartnerInfoConfig> {
        return this._http.get<PartnerInfoConfig>(`${this.baseHref}/${ENDPOINT_URL}`);
    }
}
