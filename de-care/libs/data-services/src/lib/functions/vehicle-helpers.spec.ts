import { radioLastFour, radioOrVinType } from './vehicle-helpers';

describe('vehicle helpers functions', () => {
    describe('radioOrVinType', () => {
        it('should return "radioId" if the input parameter is between 8 and 12 characters', () => {
            const mockRadioOrVin1 = '12345678';
            const mockRadioOrVin2 = '123456789';
            const mockRadioOrVin3 = '1234567890';
            const mockRadioOrVin4 = '1234567890123';

            expect(radioOrVinType(mockRadioOrVin1)).toBe('radioId');
            expect(radioOrVinType(mockRadioOrVin2)).toBe('radioId');
            expect(radioOrVinType(mockRadioOrVin3)).toBe('radioId');
            expect(radioOrVinType(mockRadioOrVin4)).not.toBe('radioId');
        });
        it('should return "vin" if the input parameter is 17 characters', () => {
            const mockRadioOrVin1 = '12345678901234';
            const mockRadioOrVin2 = '123456789012345';
            const mockRadioOrVin3 = '12345678901234567';
            const mockRadioOrVin4 = '123456789012';

            expect(radioOrVinType(mockRadioOrVin1)).not.toBe('vin');
            expect(radioOrVinType(mockRadioOrVin2)).not.toBe('vin');
            expect(radioOrVinType(mockRadioOrVin3)).toBe('vin');
            expect(radioOrVinType(mockRadioOrVin4)).not.toBe('vin');
        });
        it('should return "" if the input parameter is less than 8, between 13 and 16, or greater than 17 characters', () => {
            const mockRadioOrVin1 = '123';
            const mockRadioOrVin2 = '123456';
            const mockRadioOrVin3 = '1234567890123456789';
            const mockRadioOrVin4 = '1234567890123';

            expect(radioOrVinType(mockRadioOrVin1)).toBe('');
            expect(radioOrVinType(mockRadioOrVin2)).toBe('');
            expect(radioOrVinType(mockRadioOrVin3)).toBe('');
            expect(radioOrVinType(mockRadioOrVin4)).toBe('');
        });
    });
    describe('radioLastFour', () => {
        it('should return the radio id or vin supplied if less than four digits in length', () => {
            const mockRadioOrVin1 = '123';
            const mockRadioOrVin2 = '12';
            const mockRadioOrVin3 = '1';

            expect(radioLastFour(mockRadioOrVin1)).toBe('123');
            expect(radioLastFour(mockRadioOrVin2)).toBe('12');
            expect(radioLastFour(mockRadioOrVin3)).toBe('1');
        });
        it('should return the last four digits of the radio or vin number supplied', () => {
            const mockRadioOrVin2 = '123456';
            const mockRadioOrVin3 = '1234567890123456789';
            const mockRadioOrVin4 = '1234567890123';

            expect(radioLastFour(mockRadioOrVin2)).toBe('3456');
            expect(radioLastFour(mockRadioOrVin3)).toBe('6789');
            expect(radioLastFour(mockRadioOrVin4)).toBe('0123');
        });
    });
});
