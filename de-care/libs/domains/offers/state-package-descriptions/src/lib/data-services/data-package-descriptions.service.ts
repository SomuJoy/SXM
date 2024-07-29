import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MICROSERVICE_API_BASE_URL } from '@de-care/shared/configuration-tokens-microservices';
import { MicroservicesEndpointService } from '@de-care/shared/de-microservices-common';

export type PackageDescriptionLocales = 'en_CA' | 'en_US' | 'fr_CA';

export interface PackageDescriptionModel {
    name: string;
    company: string;
    packageName: string;
    channelLineUpURL?: string;
    header: string;
    footer: string;
    promoFooter: string;
    description: string;
    channels: Array<ChannelModel>;
    packageOverride: PackageOverride[];
    upgradeInfo?: {
        monthly: {
            header: string;
            description: string[];
        };
        annual: {
            header: string;
            description: string[];
        };
        name?: string;
    };
    packageDiff?: {
        packageName: string;
        excludedChannels?: {
            descriptions: string[];
        }[];
        additionalChannels?: {
            descriptions: string[];
        }[];
    }[];
}

interface ChannelModel {
    title: string;
    descriptions: Array<string>;
    count: string;
    featureSummary?: Array<FeatureSummaryModel>;
}

interface PackageOverride {
    name: string;
    type: string;
    promoFooter: string;
}

interface FeatureSummaryModel {
    name: string;
    capability: 'ALL' | 'SOME' | 'FEW' | 'NONE';
}

interface AllPackageDescriptionsPayload {
    locale: PackageDescriptionLocales;
    oemDevice?: boolean;
}

interface ResponseData {
    packagesDescription: PackageDescriptionModel[];
}

const ENDPOINT_URL = '/offers/all-package-desc';

@Injectable({ providedIn: 'root' })
export class DataPackageDescriptionsService extends MicroservicesEndpointService {
    constructor(@Inject(MICROSERVICE_API_BASE_URL) apiUrl: string, http: HttpClient) {
        super(apiUrl, http);
    }

    allPackageDescriptions(request: AllPackageDescriptionsPayload): Observable<PackageDescriptionModel[]> {
        const options = { withCredentials: true };
        return this._post<AllPackageDescriptionsPayload, ResponseData, null, null>(`${this._apiUrl}${ENDPOINT_URL}`, request, options).pipe(
            map((data) => data.packagesDescription)
        );
    }
}
