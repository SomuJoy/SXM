import { runValidators } from './sxm-validators.spec-utils';

describe('SxmValidators', () => {
    describe('runValidators test helper', () => {
        it('should call functions and stop when one returns non null value', () => {
            const functionA = jest.fn(() => null);
            const functionB = jest.fn(() => ({ error: true }));
            const functionC = jest.fn(() => null);
            const functions = [functionA, functionB, functionC];
            runValidators('', functions);
            expect(functionA).toHaveBeenCalled();
            expect(functionB).toHaveBeenCalled();
            expect(functionC).not.toHaveBeenCalled();
        });
    });
});
