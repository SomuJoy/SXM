import { ObjectTokenizerService } from './object-tokenizer.service';

describe('ObjectTokenizerService ', () => {
    describe('Positive Test Scenarios', () => {
        it('tokenize(): should tokenize a simple object', () => {
            interface TestObject {
                [key: string]: string;
            }
            const initialValue: TestObject = { prop1: 'foo' };
            const expectedResult = 'eyJwcm9wMSI6ImZvbyJ9';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize(initialValue)).toStrictEqual(expectedResult);
        });

        it('tokenize(): should tokenize a complex object', () => {
            interface TestObject {
                [key: string]: string | TestObject;
            }
            const initialValue: TestObject = { prop1: 'foo', bar: { prop1: 'prop1' } };
            const expectedResult = 'eyJwcm9wMSI6ImZvbyIsImJhciI6eyJwcm9wMSI6InByb3AxIn19';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize(initialValue)).toStrictEqual(expectedResult);
        });

        it('tokenize(): should de-tokenize a simple object', () => {
            interface TestObject {
                [key: string]: string;
            }
            const initialValue = 'eyJwcm9wMSI6ImZvbyJ9';
            const expected: TestObject = { prop1: 'foo' };
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.detokenize(initialValue)).toStrictEqual(expected);
        });

        it('de-tokenize(): should de-tokenize a complex object', () => {
            interface TestObject {
                [key: string]: string | TestObject;
            }
            const initialValue = 'eyJwcm9wMSI6ImZvbyIsImJhciI6eyJwcm9wMSI6InByb3AxIn19';
            const expectedResult = { prop1: 'foo', bar: { prop1: 'prop1' } };
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.detokenize(initialValue)).toStrictEqual(expectedResult);
        });
    });
    describe('Negative Test Scenarios', () => {
        it('tokenize(): should return an empty string if a null payload is passed', () => {
            const initialValue = null;
            const expectedResult = '';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize(initialValue)).toStrictEqual(expectedResult);
        });

        it('tokenize(): should return an empty string if an undefined payload is passed', () => {
            const initialValue = undefined;
            const expectedResult = '';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize(initialValue)).toStrictEqual(expectedResult);
        });

        it('tokenize(): should return an empty string if non object payload is passed: function parameter supplied', () => {
            const initialValue = function() {};
            const expectedResult = '';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize(initialValue)).toStrictEqual(expectedResult);
        });

        it('tokenize(): should return an empty string if non object or empty object payload is passed: primitive parameter supplied', () => {
            const expectedResult = '';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.tokenize({})).toStrictEqual(expectedResult);
            expect(objectTokenizerService.tokenize([])).toStrictEqual(expectedResult);
            expect(objectTokenizerService.tokenize(true)).toStrictEqual(expectedResult);
            expect(objectTokenizerService.tokenize('foo')).toStrictEqual(expectedResult);
            expect(objectTokenizerService.tokenize(2)).toStrictEqual(expectedResult);
            expect(objectTokenizerService.tokenize(Math.LOG10E)).toStrictEqual(expectedResult);
        });

        it('de-tokenize(): should return an object with an error property if an error is encountered', () => {
            const initialValue = 'eyJwcm9wMSI6ImZvbyI';
            const objectTokenizerService = new ObjectTokenizerService();
            expect(objectTokenizerService.detokenize(initialValue)).toHaveProperty('error');
        });
    });
});
