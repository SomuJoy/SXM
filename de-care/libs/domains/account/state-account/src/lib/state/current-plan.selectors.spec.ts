import { getCurrentPlanSummary } from './current-plan.selectors';

describe('state purchase selectors', () => {
    it('yourCurrentPlan should return a mapped object with needed properties from a full price plan', () => {
        const mockPlan = {
            packageName: 'SXM_SIR_AUD_ALLACCESS',
            price: 500,
            termLength: 12,
            type: 'SELF_PAID'
        };
        const result = getCurrentPlanSummary.projector(mockPlan);
        expect(result.price).toBe(500);
        expect(result.isCanada).toBeFalsy();
    });

    it('yourCurrentPlan should return a mapped object with needed properties from a promo plan in Quebec', () => {
        const mockPlan = {
            packageName: 'SXM_SIR_AUD_ALLACCESS',
            price: 500,
            termLength: 12,
            type: 'PROMO'
        };
        const result = getCurrentPlanSummary.projector(mockPlan, true, true);
        expect(result.type).toBe('PROMO');
        expect(result.isCanada).toBe(true);
        expect(result.isQuebec).toBe(true);
    });
});
