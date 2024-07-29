import { FormControl } from '@angular/forms';
import { getSxmValidator } from './sxm-validators.constant';
import { runValidators } from './sxm-validators.spec-utils';

describe('SxmValidators', () => {
    describe('address - Canada - English', () => {
        describe('valid', () => {
            it('should return null for valid address', () => {
                const validators = getSxmValidator('address', 'ca', 'en-CA');
                expect(runValidators(new FormControl('Valid Address'), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return address format error for string that does not look like an address', () => {
                const validators = getSxmValidator('address', 'ca', 'en-CA');
                expect(runValidators(new FormControl('test~address'), validators)).toHaveProperty('pattern');
            });
        });
    });

    describe('address - Canada - French', () => {
        describe('valid', () => {
            it('should return null for valid address', () => {
                const validators = getSxmValidator('address', 'ca', 'fr-CA');
                expect(runValidators(new FormControl('Valid Address'), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return address format error for string that does not look like an address', () => {
                const validators = getSxmValidator('address', 'ca', 'fr-CA');
                expect(runValidators(new FormControl('random* Address'), validators)).toHaveProperty('pattern');
            });
        });
    });

    describe('address - US', () => {
        describe('valid', () => {
            it('should return null for valid alpha email', () => {
                const validators = getSxmValidator('address', 'us');
                expect(runValidators(new FormControl(`valid' Address`), validators)).toEqual(null);
            });
        });
        describe('invalid', () => {
            it('should return address format error for string that does not look like an address', () => {
                const validators = getSxmValidator('address', 'us');
                expect(runValidators(new FormControl('invalid Address~*'), validators)).toHaveProperty('pattern');
            });
        });
    });
});
