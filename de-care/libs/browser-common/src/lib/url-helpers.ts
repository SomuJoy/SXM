import { HttpParams } from '@angular/common/http';
import { ParamMap, Params } from '@angular/router';

interface ParamMapPlaceholder {
    originalKey: string;
    originalValue: string;
}

export function getBaseLocationUrl(): string | null {
    return getBaseLocation(document);
}

export function getBaseLocation(doc: Document): string | null {
    const baseElement = doc.querySelector('base');
    const urlFromBaseHref = !!baseElement && baseElement.getAttribute('href');
    return _removeDuplicateBaseHref(doc?.location?.origin, urlFromBaseHref);
}

function _removeDuplicateBaseHref(origin: string, baseHref: string) {
    if (!origin) {
        return '/';
    }

    if (!baseHref) {
        return addTrailingSlash(origin);
    }

    const originWithoutTrailingSlash = _removeTrailingSlash(origin);
    const baseHrefWithoutTrailingSlash = _removeLeadingSlash(_removeTrailingSlash(baseHref));

    if (originWithoutTrailingSlash.indexOf(baseHrefWithoutTrailingSlash) !== -1) {
        return `${originWithoutTrailingSlash}/`;
    }

    return `${originWithoutTrailingSlash}/${baseHrefWithoutTrailingSlash}/`;
}

function _removeTrailingSlash(str: string) {
    if (str) {
        return str.replace(/\/$/, '');
    }

    return '';
}

function _removeLeadingSlash(str: string) {
    if (str) {
        return str.replace(/^\//, '');
    }

    return '';
}

function addTrailingSlash(str: string): string {
    if (!str || str.length === 0) {
        return '/';
    }

    return str[-1] !== '/' ? str + '/' : str;
}

export function getBaseUrlFromLocation({ protocol, hostname }: Partial<Location>): string {
    return `${protocol}//${hostname}`;
}

export function getCaseInsensitiveFromHttpParams(paramName: string, httpParams: HttpParams): string {
    const params = httpParams.keys();
    const lowerCaseParamName = paramName.toLowerCase();
    const param = params.find(prm => prm.toLowerCase() === lowerCaseParamName);
    if (param) {
        return httpParams.get(param);
    }
    return null;
}

export function setCaseInsensitiveFromHttpParams(paramName: string, value: string, httpParams: HttpParams): HttpParams {
    const params = httpParams.keys();
    const lowerCaseParamName = paramName.toLowerCase();
    const param = params.find(prm => prm.toLowerCase() === lowerCaseParamName);
    if (!param) {
        return httpParams.set(paramName, value);
    } else {
        return httpParams.set(param, value);
    }
}

export function convertObjectToUrlQueryParamsString(params: { [key: string]: any }): string {
    return Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}

const urlProtocolRegex = new RegExp(/^(http|\/\/)/i);
export function urlIncludesProtocol(url: string): boolean {
    return urlProtocolRegex.test(url);
}

export interface QueryParamMap {
    [key: string]: string;
}

function setOptionallyMappedKeyForObject(target: QueryParamMap, key: string, val: string, map: QueryParamMap | undefined) {
    const decodedKey = decodeURIComponent(key);
    const decodedVal = decodeURIComponent(val);

    const keyToUse = map === undefined || !map[decodedKey] ? decodedKey : map[decodedKey];

    Object.assign(target, {
        [keyToUse]: decodedVal
    });

    return target;
}

/**
 * Converts a queryString to an object
 * @param searchStr use document.location.search
 * @param map (optional) map of keys to remap from query params
 */
export function convertQueryParamsToObject(searchStr: string, map?: QueryParamMap): QueryParamMap {
    const questionMarkPos = searchStr.indexOf('?');

    const paramStr = questionMarkPos === 0 ? searchStr.substr(questionMarkPos + 1) : searchStr;

    const params = paramStr.split('&').reduce((accum, item) => {
        const [key, val] = item.split('=');

        if (key !== undefined && val !== undefined && key.length > 0 && val.length > 0) {
            setOptionallyMappedKeyForObject(accum, key, val, map);
        }

        return accum;
    }, {});

    return params;
}

export function getCaseInsensitiveQueryParam(searchStr: string, key: string): string | undefined {
    const params = convertQueryParamsToObject(searchStr);
    const matchingKey = Object.keys(params).find(existingKey => existingKey.toLowerCase() === key.toLowerCase());
    return matchingKey ? params[matchingKey] : undefined;
}

export function omitParamsCaseInsensitive(paramMap: ParamMap, ...keysToRemove) {
    // Store a placeholder map of the lower-cased keys and remember the original key and value
    // Note: We're only using `get` and not `getAll`
    const lowerCasedParamMap: { [lowerCasedKey: string]: ParamMapPlaceholder } = paramMap.keys.reduce((accum, key) => {
        accum[key.toLowerCase()] = {
            originalKey: key,
            originalValue: paramMap.get(key)
        };

        return accum;
    }, {});

    // Remove the corresponding items for the keys provided (match lower-cased keys)
    keysToRemove.forEach(keyToRemove => {
        const lowerCasedKeyToRemove = keyToRemove.toLowerCase();

        if (lowerCasedParamMap[lowerCasedKeyToRemove]) {
            delete lowerCasedParamMap[lowerCasedKeyToRemove];
        }
    });

    // Convert from the placeholder map back to Params with original keys
    return Object.values(lowerCasedParamMap).reduce<Params>((accum, placeholder) => {
        accum[placeholder.originalKey] = placeholder.originalValue;
        return accum;
    }, {} as Params);
}
