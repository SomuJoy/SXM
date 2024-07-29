import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class UrlHelperService {
    getCaseInsensitiveParam(paramMap: ParamMap, keyToFind: string): string | null {
        const key = paramMap.keys.find(k => k.toLowerCase() === keyToFind.toLowerCase());
        // Note: ParamMap.get will return null if no key is found so we don't need to check key before using it here.
        return paramMap.get(key);
    }
    getIfQueryParamExists(field: string, url: string): boolean {
        const urlLowerCase = url.toLowerCase();
        return urlLowerCase.indexOf('?' + field.toLowerCase() + '=') !== -1 || urlLowerCase.indexOf('&' + field.toLowerCase() + '=') !== -1;
    }
}
