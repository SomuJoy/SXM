import { Mock } from 'ts-mockery';
import {
    convertQueryParamsToObject,
    getBaseUrlFromLocation,
    convertObjectToUrlQueryParamsString,
    urlIncludesProtocol,
    getCaseInsensitiveQueryParam,
    omitParamsCaseInsensitive,
    getBaseLocation
} from './url-helpers';
import { convertToParamMap } from '@angular/router';

describe('getBaseUrlFromLocation', () => {
    it('should return the same value when there is no port or extra url parts', () => {
        expect(getBaseUrlFromLocation(createLocation('http://test.com'))).toBe('http://test.com');
    });
    it('should return the protocol and hostname as a single string with no port', () => {
        expect(getBaseUrlFromLocation(createLocation('http://test.com:4200'))).toBe('http://test.com');
    });
    it('should return the protocol and hostname as a single string with no extra url parts', () => {
        expect(getBaseUrlFromLocation(createLocation('http://test.com/deep?key=val'))).toBe('http://test.com');
    });
});

describe('convertObjectToUrlQueryParamsString', () => {
    it('should return an empty string when no params are passed', () => {
        expect(convertObjectToUrlQueryParamsString({})).toBe('');
    });
    it('should return a single key=value string with same casing for key name', () => {
        expect(convertObjectToUrlQueryParamsString({ keyWithCasing: 'value' })).toBe('keyWithCasing=value');
        expect(convertObjectToUrlQueryParamsString({ keyWithCasing: 'value' })).not.toBe('keywithcasing=value');
    });
    it('should return a single key=value string when one param is passed', () => {
        expect(convertObjectToUrlQueryParamsString({ key: 'value' })).toBe('key=value');
    });
    it('should return key=value separated by an & when more than one param is passed', () => {
        expect(convertObjectToUrlQueryParamsString({ key1: 'one', key2: 'two' })).toBe('key1=one&key2=two');
        expect(convertObjectToUrlQueryParamsString({ key1: 'one', key2: 'two', key3: 'three' })).toBe('key1=one&key2=two&key3=three');
    });
    it('should return a single key=value string with the key url encoded', () => {
        expect(convertObjectToUrlQueryParamsString({ 'my key': 'value' })).toBe('my%20key=value');
    });
    it('should return a single key=value string with the value url encoded', () => {
        expect(convertObjectToUrlQueryParamsString({ key: 'my value' })).toBe('key=my%20value');
    });
});

describe('urlIncludesProtocol', () => {
    it('should return true if url starts with http', () => {
        expect(urlIncludesProtocol('http://test.com')).toBe(true);
    });
    it('should return true if url starts with https', () => {
        expect(urlIncludesProtocol('https://test.com')).toBe(true);
    });
    it('should return true if url starts with http regardless of casing', () => {
        expect(urlIncludesProtocol('HTTP://TEST.COM')).toBe(true);
    });
    it('should return true if url starts with https regardless of casing', () => {
        expect(urlIncludesProtocol('HTTPS://TEST.COM')).toBe(true);
    });
    it('should return true if url starts with // to support same protocol', () => {
        expect(urlIncludesProtocol('//test.com')).toBe(true);
    });
    it('should return false if url does not start with http', () => {
        expect(urlIncludesProtocol(':4200/path')).toBe(false);
        expect(urlIncludesProtocol('/path/another-path')).toBe(false);
    });
});

describe('convertQueryParamsToObject', () => {
    it('should return empty object if string is empty', () => {
        expect(convertQueryParamsToObject('')).toEqual({});
    });

    it('should return a map for valid querystring', () => {
        expect(convertQueryParamsToObject('?key=val')).toEqual({ key: 'val' });
    });

    it('should omit invalid items in querystring', () => {
        expect(convertQueryParamsToObject('?key=val&incorrectFormat&=nokey&noval=')).toEqual({ key: 'val' });
    });

    it('should decode keys and values', () => {
        expect(convertQueryParamsToObject('?key%2B=val%2C')).toEqual({ 'key+': 'val,' });
    });
});

function createLocation(url: string): Partial<Location> {
    const anchorTag = document.createElement('a');
    anchorTag.href = url;
    return anchorTag;
}

describe('getCaseInsensitiveQueryParam', () => {
    it('should return a value regardless of casing', () => {
        expect(getCaseInsensitiveQueryParam('?testkey=val', 'testKey')).toEqual('val');
    });
    it('should return undefined if key is not found', () => {
        expect(getCaseInsensitiveQueryParam('?testkey=val', 'test')).toBeUndefined();
    });
});

describe('removeParams', () => {
    const sampleParams = {
        a: 'a',
        B: 'B',
        c: 'c'
    };

    const sampleParamMap = convertToParamMap(sampleParams);

    it('should return the original map if there are no keys to remove', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap);

        expect(actual).toEqual(sampleParams);
    });

    it('should ignore non-existent keys', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap, 'error');

        expect(actual).toEqual(sampleParams);
    });

    it('should remove single key', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap, 'a');

        expect(actual).toEqual({ B: 'B', c: 'c' });
    });

    it('should remove multiple keys', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap, 'a', 'c');

        expect(actual).toEqual({ B: 'B' });
    });

    it('should remove case-insensitively on queryParam keys', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap, 'b');

        expect(actual).toEqual({ a: 'a', c: 'c' });
    });

    it('should remove case-insensitively on provided keys', () => {
        const actual = omitParamsCaseInsensitive(sampleParamMap, 'A');

        expect(actual).toEqual({ B: 'B', c: 'c' });
    });
});

describe('getBaseLocation', () => {
    test.each`
        description                                                                        | origin                                  | base             | result
        ${'should append base url if tag exists'}                                          | ${'http://www.siriusxm.com'}            | ${'/something/'} | ${'http://www.siriusxm.com/something/'}
        ${'should append slash to base url if tag exists'}                                 | ${'http://www.siriusxm.com'}            | ${'/something'}  | ${'http://www.siriusxm.com/something/'}
        ${'should return origin with slash if base href missing'}                          | ${'http://www.siriusxm.com'}            | ${null}          | ${'http://www.siriusxm.com/'}
        ${'should not duplicate base href'}                                                | ${'http://www.siriusxm.com/something'}  | ${'/something'}  | ${'http://www.siriusxm.com/something/'}
        ${'should not duplicate base href (with trailing slashes)'}                        | ${'http://www.siriusxm.com/something'}  | ${'/something/'} | ${'http://www.siriusxm.com/something/'}
        ${'should not duplicate base href (with no slashes)'}                              | ${'http://www.siriusxm.com/something'}  | ${'something'}   | ${'http://www.siriusxm.com/something/'}
        ${'should not duplicate base href (origin has trailing slash, base has no slash)'} | ${'http://www.siriusxm.com/something/'} | ${'something'}   | ${'http://www.siriusxm.com/something/'}
        ${'should not duplicate base href (only slash)'}                                   | ${'http://www.siriusxm.com/something'}  | ${'/'}           | ${'http://www.siriusxm.com/something/'}
    `('$description', ({ origin, base, result }) => {
        const doc = Mock.of<Document>({
            querySelector: jest.fn().mockReturnValue({ getAttribute: () => base }),
            location: { origin }
        });

        expect(getBaseLocation(doc)).toEqual(result);
    });
});
