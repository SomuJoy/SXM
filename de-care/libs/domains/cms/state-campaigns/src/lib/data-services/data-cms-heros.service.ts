import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';

const ENDPOINT_URL = '/SXMHero';
const ENDPOINT_URL_ASSETS = `${ENDPOINT_URL}/assets`;

export interface CmsHeroAssetModel {
    hero_background_image: string;
    hero_foreground_image: string;
    hero_headline: string;
    hero_sub_headline: string;
}

@Injectable({ providedIn: 'root' })
export class DataCmsHerosService {
    constructor(private readonly _http: HttpClient, @Inject(CMS_API_BASE_URL) private readonly _apiUrl: string) {}

    getHeroAssetById(assetId: number): Observable<CmsHeroAssetModel> {
        return this._http.get<CmsHeroAssetModel>(`${this._apiUrl}${ENDPOINT_URL_ASSETS}/${assetId}`);
    }
}
