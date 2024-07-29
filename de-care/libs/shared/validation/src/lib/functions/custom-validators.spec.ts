import { AbstractControl } from '@angular/forms';
import { Mock } from 'ts-mockery';
import { minMaxNumberValidator, radioIdOrVinValidator } from './custom-validators';

function getControlWithValue(value: string | number | null) {
    return Mock.of<AbstractControl>({ value });
}

describe('Custom validators', () => {
    describe('radioIdOrVinValidator', () => {
        const invalidResult = { invalidRadioIdOrVin: true };

        test.each`
            value                    | what         | why
            ${'ABCDEFGH'}            | ${'radioId'} | ${'8 alphabets'}
            ${'12345678'}            | ${'radioId'} | ${'8 numbers'}
            ${'ABCD5678'}            | ${'radioId'} | ${'8 alphanumeric'}
            ${'ABCD567890'}          | ${'radioId'} | ${'10 alphanumeric'}
            ${'ABCD56789012'}        | ${'radioId'} | ${'12 alphanumeric'}
            ${'    ABCDEFGH   '}     | ${'radioId'} | ${'leading and trailing spaces'}
            ${'1234567890ABCDEFG'}   | ${'vin'}     | ${'17 chars'}
            ${' 1234567890ABCDEFG '} | ${'vin'}     | ${'leading and trailing spaces'}
        `('should pass for $what with $why', ({ value }) => {
            const ctl = getControlWithValue(value);
            expect(radioIdOrVinValidator(ctl)).toBeNull();
        });

        test.each`
            value            | what
            ${'ABCD578'}     | ${'7 alphanumeric'}
            ${'ABCD56789'}   | ${'9 alphanumeric'}
            ${'ABCD5678901'} | ${'11 alphanumeric'}
        `('should fail for $what', ({ value }) => {
            const ctl = getControlWithValue(value);
            expect(radioIdOrVinValidator(ctl)).toEqual(invalidResult);
        });

        test('should fail for null', () => {
            const ctl = getControlWithValue(null);
            expect(radioIdOrVinValidator(ctl)).toEqual(invalidResult);
        });
    });

    describe('min max validator', () => {
        const invalidMinResult = { minValue: { valid: false } };
        const invalidMaxResult = { maxValue: { valid: false } };

        it('should be invalid with less digits than the min', () => {
            const ctl = getControlWithValue(123);
            expect(minMaxNumberValidator(4)(ctl)).toEqual(invalidMinResult);
        });

        it('should be invalid with more digits than the max', () => {
            const ctl = getControlWithValue(1235);
            expect(minMaxNumberValidator(0, 3)(ctl)).toEqual(invalidMaxResult);
        });

        it('should be valid with equal digits to the min', () => {
            const ctl = getControlWithValue(623421);
            expect(minMaxNumberValidator(6)(ctl)).toBeNull();
        });

        it('should be valid with more digits than the min', () => {
            const ctl = getControlWithValue(1230982);
            expect(minMaxNumberValidator(6)(ctl)).toBeNull();
        });

        it('should be valid with equal digits to the max', () => {
            const ctl = getControlWithValue(68);
            expect(minMaxNumberValidator(0, 2)(ctl)).toBeNull();
        });

        it('should be valid with less digits than the max', () => {
            const ctl = getControlWithValue(6);
            expect(minMaxNumberValidator(0, 2)(ctl)).toBeNull();
        });

        it('should be valid within the range of max and min', () => {
            const ctl = getControlWithValue(91783);
            expect(minMaxNumberValidator(5, 10)(ctl)).toBeNull();
            expect(minMaxNumberValidator(2, 7)(ctl)).toBeNull();
        });
    });
});
