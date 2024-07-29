import { regexCanadianEnglishAndFrenchEmail } from './sxm-validators.constant';
import { FormControl, Validators } from '@angular/forms';

describe('SxmValidator regex patterns', () => {
    describe('regexCanadianEnglishAndFrenchEmail', () => {
        describe('regex pattern', () => {
            it('should return match for valid alpha email', () => {
                const regex = new RegExp(regexCanadianEnglishAndFrenchEmail);
                expect(regex.test('test@test.com')).toEqual(true);
            });
            it('should return match for valid alphanumeric email', () => {
                const regex = new RegExp(regexCanadianEnglishAndFrenchEmail);
                expect(regex.test('test20@test.com')).toEqual(true);
                expect(regex.test('test@test20.com')).toEqual(true);
                expect(regex.test('test@test.com')).toEqual(true);
            });
        });
        describe('used with Angular pattern validator', () => {
            it('should return null for alpha email', () => {
                expect(Validators.pattern(regexCanadianEnglishAndFrenchEmail)(new FormControl('test@test.com'))).toEqual(null);
            });
            it('should return null for alphanumeric email', () => {
                expect(Validators.pattern(regexCanadianEnglishAndFrenchEmail)(new FormControl('test20@test.com'))).toEqual(null);
                expect(Validators.pattern(regexCanadianEnglishAndFrenchEmail)(new FormControl('test@test20.com'))).toEqual(null);
                expect(Validators.pattern(regexCanadianEnglishAndFrenchEmail)(new FormControl('test@test.com20'))).toEqual(null);
            });
        });
    });
});
