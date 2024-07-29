import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CMS_API_BASE_URL } from '@de-care/shared/configuration-tokens-cms';
import { Observable } from 'rxjs';

const ENDPOINT_URL = '/SXMContentGroup';
const ENDPOINT_URL_ASSETS = `${ENDPOINT_URL}/assets`;

@Injectable({ providedIn: 'root' })
export class ContentGroupService {
    constructor(private readonly _http: HttpClient, @Inject(CMS_API_BASE_URL) private readonly _apiUrl: string) {}

    getContentGroupByName(name: string): Observable<ContentGroupByName> {
        return this._http.get<ContentGroupByName>(`${this._apiUrl}${ENDPOINT_URL}`, { params: { filter: `name:equals:${name}` } });
    }

    getContentGroupAssetsById(id: number): Observable<ContentGroupAssets> {
        return this._http.get<ContentGroupAssets>(`${this._apiUrl}${ENDPOINT_URL_ASSETS}/${id}`);
    }
}

export interface ContentGroupByName {
    assets: Asset[];
    offset: number;
    count: number;
    next: string;
    previous: string;
    total: number;
    lastModified: number;
}
interface Asset {
    id: number;
    type: string;
    subtype: string;
    url: string;
    site: string;
    lastModified: number;
}

export interface ContentGroupAssets {
    template: string;
    associations: Associations;
    updatedby: string;
    html_id: string;
    createddate: number;
    isactive: boolean;
    ispersonalized: boolean;
    description: string;
    type: string;
    path: string;
    Assoc_Named_content: AssocNamedContent[];
    component_type: string;
    createdby: string;
    subtype: string;
    id: number;
    datalayer: string;
    flextemplateid: Flextemplateid;
    has_started: boolean;
    fw_uid: string;
    url: Url;
    'dimension-parents': any[];
    site: string;
    is_valid: boolean;
    name: string;
    updateddate: number;
    has_finished: boolean;
    properties: Properties;
    status: string;
    parents: Parents;
}

export interface Content {
    id: any;
    type: string;
    subtype: string;
    url: string;
    site: string;
    lastModified: any;
}
export interface Associations {
    content: Content[];
}
export interface AssocNamedContent {
    id: any;
    type: string;
    subtype: string;
    url: string;
    site: string;
    lastModified: any;
}
export interface Flextemplateid {
    id: number;
    type: string;
    subtype: string;
    url: string;
    site: string;
    lastModified: number;
}
export interface Url {
    [key: string]: unknown;
}

export interface Properties {
    'package.collapse-title': string;
}

export interface Parents {
    [key: string]: unknown;
}
