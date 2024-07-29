import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getBaseUrlFromLocation, urlIncludesProtocol } from '@de-care/browser-common';
import { HttpParams } from '@angular/common/http';
import { CoreLoggerService } from '@de-care/data-layer';

@Injectable({ providedIn: 'root' })
export class ElementsNavigationService {
    constructor(@Inject(DOCUMENT) private readonly _document: Document, private readonly _coreLoggerService: CoreLoggerService) {}

    getQueryParams(): HttpParams {
        if (!this._document) {
            throw new Error('Cannot fetch query params, location object is not available');
        }
        return new HttpParams({
            fromString: this._document.location.search.replace('?', '')
        });
    }

    onSuccessNavigateTo(successUrl: string, queryParams: string): void {
        if (!successUrl) {
            this._coreLoggerService.warn('The successUrl param was empty in call to onSuccessNavigateTo');
            return;
        }
        if (!this._document) {
            throw new Error('Cannot navigate, location object is not available');
        }
        const { location } = this._document;
        location.href = this.genUrl(successUrl, queryParams);
    }

    genUrl(successUrl: string, queryParams: string) {
        queryParams = queryParams ? `?${queryParams}` : '';
        if (urlIncludesProtocol(successUrl)) {
            return `${successUrl}${queryParams}`;
        } else {
            const baseUrl = getBaseUrlFromLocation(location);
            return `${baseUrl}${successUrl}${queryParams}`;
        }
    }
}
