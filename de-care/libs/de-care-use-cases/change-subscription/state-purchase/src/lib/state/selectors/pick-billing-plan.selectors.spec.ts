import { getCanSelectTerm } from './pick-billing-plan.selectors';

describe('pick billing plan selectors', () => {
    describe('getCanSelectTerm', () => {
        it('should return true if there is a selected offer and it is self pay', () => {
            expect(getCanSelectTerm.projector([], { type: 'SELF_PAY' })).toBe(true);
        });
        it('should return false if there is a selected offer and it is NOT self pay', () => {
            expect(getCanSelectTerm.projector([], { type: '' })).toBe(false);
        });
        it('should return true if there is NO selected offer but there more than 1 current offer', () => {
            expect(getCanSelectTerm.projector([{}, {}], null)).toBe(true);
        });
        it('should return false if there is NO selected offer and there IS NOT more than 1 current offer', () => {
            expect(getCanSelectTerm.projector([{}], null)).toBe(false);
        });
        it('should return false if there is NO selected offer and no current offer', () => {
            expect(getCanSelectTerm.projector([], null)).toBe(false);
        });
    });
});
