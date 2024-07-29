import { FormControl } from '@angular/forms';
import { getSxmValidator } from './sxm-validators.constant';
import { runValidators } from './sxm-validators.spec-utils';

describe('SxmValidators', () => {
    describe('email - Canada - English', () => {
        describe('valid', () => {
            it('should return null for valid alphanumeric email', () => {
                const validators = getSxmValidator('email', 'ca', 'en-CA');
                expect(runValidators(new FormControl('test20@test.com'), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return email format error for string that does not look like an email address', () => {
                const validators = getSxmValidator('email', 'ca', 'en-CA');
                expect(runValidators(new FormControl('testvalue'), validators)).toHaveProperty('pattern');
            });
            it('should return email format error for string that has more than one @ char', () => {
                const validators = getSxmValidator('email', 'ca', 'en-CA');
                expect(runValidators(new FormControl('test@@test.com'), validators)).toHaveProperty('pattern');
            });
        });
    });
    describe('email - Canada - French', () => {
        describe('valid', () => {
            it('should return null for valid alphanumeric email', () => {
                const validators = getSxmValidator('email', 'ca', 'fr-CA');
                expect(runValidators(new FormControl('test20@test.com'), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return email format error for string that does not look like an email address', () => {
                const validators = getSxmValidator('email', 'ca', 'fr-CA');
                expect(runValidators(new FormControl('testvalue'), validators)).toHaveProperty('pattern');
            });
            it('should return email format error for string that has more than one @ char', () => {
                const validators = getSxmValidator('email', 'ca', 'fr-CA');
                expect(runValidators(new FormControl('test@@test.com'), validators)).toHaveProperty('pattern');
            });
        });
    });
    describe('email - US', () => {
        describe('valid', () => {
            it('should return null for valid alpha email', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('test@test.com'), validators)).toEqual(null);
            });
            it('should return null for valid alpha email', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('test@test.com'), validators)).toEqual(null);
            });
            it('should return null for valid alphanumeric email', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('test20@test.com'), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return required error for empty string', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl(''), validators)).toEqual({ required: true });
            });
            it('should return email format error for string that does not look like an email address', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('testvalue'), validators)).toHaveProperty('pattern');
            });
            it('should return email format error for string that has more than one @ char', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('test@@test.com'), validators)).toHaveProperty('pattern');
            });
            it('should return cvv exclusion error for email address that contains cvv pattern', () => {
                const validators = getSxmValidator('email', 'us');
                expect(runValidators(new FormControl('mycvv999test@test.com'), validators)).toEqual({ cvvExclusion: true });
            });
        });
    });
});
