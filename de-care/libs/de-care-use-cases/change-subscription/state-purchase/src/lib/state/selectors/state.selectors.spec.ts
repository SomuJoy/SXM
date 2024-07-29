import { getSelectedPlanCodeBasedOnSelectedTerm, getSelectedTermLength } from './state.selectors';

describe('state selectors', () => {
    describe('getSelectedTermLength', () => {
        it('should return null if term type is not annual or monthly', () => {
            expect(getSelectedTermLength.projector(null)).toBe(null);
            expect(getSelectedTermLength.projector(undefined)).toBe(null);
            expect(getSelectedTermLength.projector('test')).toBe(null);
        });
        it('should return 12 if term type is annual', () => {
            expect(getSelectedTermLength.projector('annual')).toBe(12);
        });
        it('should return 1 if term type is monthly', () => {
            expect(getSelectedTermLength.projector('monthly')).toBe(1);
        });
    });

    describe('getSelectedPlanCodeBasedOnSelectedTerm', () => {
        it('should return passed in plan code if no term length', () => {
            const mockPlanCode = 'test';
            expect(getSelectedPlanCodeBasedOnSelectedTerm.projector([], null, mockPlanCode)).toBe(mockPlanCode);
        });
        it('should return plan code from offers if term length and offer with matching term length found', () => {
            const mockPlanCode = 'match';
            expect(getSelectedPlanCodeBasedOnSelectedTerm.projector([{ termLength: 1, planCode: mockPlanCode }], 1, null)).toBe(mockPlanCode);
        });
        it('should return null if term length and offer with matching term length IS NOT found', () => {
            expect(getSelectedPlanCodeBasedOnSelectedTerm.projector([{ termLength: 12 }], 1, null)).toBe(null);
        });
    });
});
