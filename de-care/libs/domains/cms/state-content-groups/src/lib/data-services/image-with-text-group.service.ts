import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/SXMImageWithTextGroup/assets';

@Injectable({ providedIn: 'root' })
export class ImageWithTextGroupService {
    constructor(private readonly _http: HttpClient, @Inject(CMS_API_BASE_URL) private readonly _apiUrl: string) {}

    getImageWithTextGroupAssets(id: number): Observable<Response> {
        return this._http.get<Response>(`${this._apiUrl}${ENDPOINT_URL}/${id}`);
    }
}

interface Response {
    template: string;
    associations: unknown;
    image_with_text_group_recommendation: {
        id: any;
        type: string;
        subtype: string;
        url: string;
        site: string;
        lastModified: any;
    }[];
    updatedby: string;
    html_id: string;
    createddate: number;
    isactive: boolean;
    ispersonalized: boolean;
    description: string;
    type: string;
    path: string;
    component_type: string;
    createdby: string;
    subtype: string;
    id: number;
    personalizable: string;
    datalayer: string;
    flextemplateid: {
        id: number;
        type: string;
        subtype: string;
        url: string;
        site: string;
        lastModified: number;
    };
    has_started: boolean;
    fw_uid: string;
    url: unknown;
    site: string;
    is_valid: boolean;
    name: string;
    updateddate: number;
    has_finished: boolean;
    properties: {
        'package.collapse-title': string;
    };
    status: string;
    parents: unknown;
}
