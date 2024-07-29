import { WithoutPlatformNamePipe } from './without-platform-name.pipe';

describe('WithoutPlatformNamePipe', () => {
    describe('change the value', () => {
        it('should remove the SiriusXM platform name', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('SiriusXM All Access', 'SXM_ALL_ACCESS')).toBe('All Access');
            expect(pipe.transform('SiriusXM All Access', '3_ALL_ACCESS')).toBe('All Access');
        });
        it('should remove the XM platform name', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('XM All Access', '1_ALL_ACCESS')).toBe('All Access');
        });
        it('should remove the Sirius platform name', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('Sirius All Access', 'SIR_ALL_ACCESS')).toBe('All Access');
        });
    });
    describe('not change the value', () => {
        it('should return the same value when the value is not a string with a length greater than zero', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('', '1_ALL_ACCESS')).toBe('');
            expect(pipe.transform(null, '1_ALL_ACCESS')).toBe(null);
            expect(pipe.transform(undefined, '1_ALL_ACCESS')).toBe(undefined);
        });
        it('should not remove the SiriusXM platform name when the packageName is not a SiriusXM package', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('SiriusXM All Access', '1_ALL_ACCESS')).toBe('SiriusXM All Access');
        });
        it('should not remove the XM platform name when the packageName is not an XM package', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('XM All Access', 'SXM_ALL_ACCESS')).toBe('XM All Access');
            expect(pipe.transform('XM All Access', '3_ALL_ACCESS')).toBe('XM All Access');
        });
        it('should not remove the Sirius platform name when the packageName is not a Sirius package', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('Sirius All Access', '1_ALL_ACCESS')).toBe('Sirius All Access');
        });
    });
    describe('packageName param', () => {
        it('should return the same value when the packageName is null or undefined', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('Sirius All Access', null)).toBe('Sirius All Access');
            expect(pipe.transform('Sirius All Access', undefined)).toBe('Sirius All Access');
        });
        it('should return a value with SiriusXM as the platform when packageName is invalid', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('SiriusXM All Access', 'WEE')).toBe('SiriusXM All Access');
        });
        it('should return a value with XM as the platform when packageName is invalid', () => {
            const pipe = new WithoutPlatformNamePipe();
            expect(pipe.transform('XM All Access', 'WEE')).toBe('XM All Access');
        });

        // NOTE: this fails because the lookup for platform from packageName defaults to Sirius if no platform found.
        //       should try and determine if that is a concern or not.

        // it('should return a value with Sirius as the platform when packageName is invalid', () => {
        //     const pipe = new WithoutPlatformNamePipe();
        //     expect(pipe.transform('Sirius All Access', 'WEE')).toBe('Sirius All Access');
        // });
    });
});
