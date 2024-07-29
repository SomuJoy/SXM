import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { CmsAsset } from './models';

const ENDPOINT_URL = '/SXMCampaign';
const ENDPOINT_URL_ASSETS = `${ENDPOINT_URL}/assets`;

interface CampaignAsset extends CmsAsset {
    type: 'SXMCampaign';
    subtype: 'Campaign';
}

export interface CmsCampaignModel {
    assets: CampaignAsset[];
    offset: number;
    count: number;
    next: string;
    previous: string;
    total: number;
    lastModified: number;
}

interface SalesHeroAsset extends CmsAsset {
    type: 'SXMHero';
    subtype: 'Hero';
}

export interface CmsCampaignAssetModel {
    sales_heros: SalesHeroAsset[];
}

@Injectable({ providedIn: 'root' })
export class DataCmsCampaignsService {
    constructor(private readonly _http: HttpClient, @Inject(CMS_API_BASE_URL) private readonly _apiUrl: string) {}

    getCampaignById(campaignId: string): Observable<CmsCampaignModel> {
        return this._http.get<CmsCampaignModel>(`${this._apiUrl}${ENDPOINT_URL}`, {
            params: {
                subtype: 'Campaign',
                filter: `campaign_id:equals:${campaignId}`,
            },
        });
    }

    getCampaignAssetById(assetId: number): Observable<CmsCampaignAssetModel> {
        return this._http.get<CmsCampaignAssetModel>(`${this._apiUrl}${ENDPOINT_URL_ASSETS}/${assetId}`);
    }
}
