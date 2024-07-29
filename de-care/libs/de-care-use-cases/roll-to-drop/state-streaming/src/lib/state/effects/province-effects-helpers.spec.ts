import { isProvinceChangedToOrFromQuebec } from './province.effect';

describe('Province Effects Helper Functions', () => {
    describe('isProvinceChangedToOrFromQuebec', () => {
        it('should return true if province changes from not-QC to QC', () => {
            expect(isProvinceChangedToOrFromQuebec('ON', 'QC')).toBeTruthy();
        });

        it('should return true if province changes from QC to not-QC', () => {
            expect(isProvinceChangedToOrFromQuebec('QC', 'ON')).toBeTruthy();
        });

        it('should return false if province changes from not-QC to not-QC', () => {
            expect(isProvinceChangedToOrFromQuebec('ON', 'ON')).toBeFalsy();
        });

        it('should return false if province changes from QC to QC', () => {
            expect(isProvinceChangedToOrFromQuebec('QC', 'QC')).toBeFalsy();
        });
    });
});
