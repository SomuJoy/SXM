import { getUserAgentPlatform } from './helpers';

describe('getUserAgentPlatform', () => {
    describe('ios', () => {
        it.each([
            'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1',
        ])('should return ios when user agent string is for ipad', (userAgent) => {
            expect(getUserAgentPlatform(userAgent)).toBe('ios');
        });
        it.each([
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        ])('should return ios when user agent string is for iphone', (userAgent) => {
            expect(getUserAgentPlatform(userAgent)).toBe('ios');
        });
        it.each(['Mozilla/5.0 (iPod; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Mobile/15E148 Safari/604.1'])(
            'should return ios when user agent string is for ipod',
            (userAgent) => {
                expect(getUserAgentPlatform(userAgent)).toBe('ios');
            }
        );
    });
    describe('android', () => {
        it.each(['Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36'])(
            'should return android when user agent string is for android',
            (userAgent) => {
                expect(getUserAgentPlatform(userAgent)).toBe('android');
            }
        );
    });
    describe('web', () => {
        it.each([
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15',
        ])('should return web when user agent string is for Mac', (userAgent) => {
            expect(getUserAgentPlatform(userAgent)).toBe('web');
        });
        it.each([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
        ])('should return web when user agent string is for Windows', (userAgent) => {
            expect(getUserAgentPlatform(userAgent)).toBe('web');
        });
    });
});
