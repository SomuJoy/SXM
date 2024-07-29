import { AbstractControl } from '@angular/forms';
import { Mock } from 'ts-mockery';
import { radioIdOrVinValidator } from './custom-validators';

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
});
